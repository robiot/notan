use tower_http::cors::Any;

use crate::utils::payments::sync;

use {
    axum::routing::get,
    axum::Router,
    colored::Colorize,
    hyper::Method,
    log::info,
    sqlx::{
        postgres::{PgConnectOptions, PgPoolOptions},
        ConnectOptions,
    },
    std::net::SocketAddr,
    std::str::FromStr,
    std::sync::Arc,
    std::time::Duration,
    tokio::select,
    tokio::sync::broadcast,
    tower_http::cors::{AllowOrigin, CorsLayer},
};

pub mod auth;
pub mod config;
pub mod error;
pub mod jwt;
pub mod logger;
pub mod routes;
pub mod schemas;
pub mod state;
pub mod utils;

const HEADER: &str = r#"
_   _       _   
| \ | |     | |                         
|  \| | ___ | |_ __ _ _ __    __ ___  __
| . ` |/ _ \| __/ _` | '_ \  / _` \ \/ /
| |\  | (_) | || (_| | | | || (_| |>  < 
|_| \_|\___/ \__\__,_|_| |_(_)__,_/_/\_\
"#;

pub async fn start(
    mut shutdown: broadcast::Receiver<()>,
    config: config::Config,
) -> error::Result<()> {
    let pg_options = PgConnectOptions::from_str(&config.database_url)?
        .log_statements(log::LevelFilter::Debug)
        .disable_statement_logging()
        .log_slow_statements(log::LevelFilter::Info, Duration::from_millis(250))
        .clone();

    let db = PgPoolOptions::new()
        .max_connections(100)
        .connect_with(pg_options)
        .await?;

    // Run database migrations. `./migrations` is the path to migrations, relative
    // to the root dir (the directory containing `Cargo.toml`).
    info!("Running migrations...");

    sqlx::migrate!("./migrations")
        .run(&db)
        .await
        .expect("Failed to migrate");

    // Create the state
    let redis_client =
        redis::Client::open(config.clone().redis_url).expect("Could not create redis client");

    let stripe_client = stripe::Client::new(config.clone().stripe_secret_key);

    let app_state = Arc::new(state::AppState {
        config,
        db,
        redis: redis_client,
        stripe: stripe_client,
        products: utils::products::products(),
    });

    // Sync stripe products
    // todo: make this not kill the server if it fails
    sync::ensure_stripe_products(app_state.clone()).await?;

    let port = app_state.config.port;

    let header = format!(
        r#"
{}
started API on {}:{},
url: http://{}:{}
     http://localhost:{}
"#,
        HEADER.blue(),
        "0.0.0.0",
        port,
        "0.0.0.0",
        port,
        port,
    );

    println!("{header}");

    let app: Router = Router::new()
        .route("/", get(routes::root::handler))
        .route("/health", get(routes::health::handler))
        .nest("/auth", routes::auth::router(app_state.clone()))
        .nest("/users", routes::users::router(app_state.clone()))
        .nest("/notes", routes::notes::router(app_state.clone()))
        .nest("/payments", routes::payments::router(app_state.clone()))
        .nest("/updates", routes::updates::router(app_state.clone()))
        .fallback(routes::not_found::handler)
        .layer(
            CorsLayer::new()
                .allow_methods([Method::GET, Method::POST, Method::DELETE, Method::PUT])
                .allow_origin(AllowOrigin::any())
                .allow_headers(Any),
        )
        .with_state(app_state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    info!("🚀 Server started");

    select! {
        _ = axum::Server::bind(&addr).serve(app.into_make_service_with_connect_info::<SocketAddr>()) => info!("Server terminating"),
        _ = shutdown.recv() => info!("Shutdown signal received, killing servers"),
    }
    Ok(())
}
