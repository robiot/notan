use {
    backend::config, backend::error::Result, dotenv::dotenv, log::info,
    tokio::sync::broadcast,
    backend::logger::Logger
};

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    Logger::init();

    let (_signal, shutdown) = broadcast::channel(1);

    let config = config::get_config()
        .expect("Failed to load config, please ensure all enviroment variables are defined.");

    let result = backend::start(shutdown, config).await;

    info!("Backend is quitting. Goodbye 👋");

    result
}
