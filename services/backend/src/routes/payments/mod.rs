pub mod buy;
pub mod methods;
pub mod prices;
pub mod products;
pub mod subscriptions;
pub mod webhook;

use crate::state::AppState;

use {
    axum::routing::{delete, get, post},
    axum::Router,
    std::sync::Arc,
};

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /payments
    Router::new()
        //
        // Buy
        //
        .route(
            "/buy/:price_id/intent",
            post(buy::price_id::intent::handler),
        )
        .route(
            "/buy/:price_id/subscribe",
            post(buy::price_id::subscribe::handler),
        )
        //
        // Subscriptions
        //
        .route(
            "/subscriptions/:id/cancel",
            post(subscriptions::id::cancel::handler),
        )
        .route("/subscriptions", get(subscriptions::get::handler))
        //
        // Products
        //
        .route(
            "/products/:product_id",
            get(products::id::get::handler),
        )
        //
        // Prices
        //
        .route("/prices", get(prices::get::handler))
        //
        // Methods
        //
        .route("/methods", get(methods::get::handler))
        .route(
            "/methods/:payment_method_id",
            post(methods::id::post::handler),
        )
        .route(
            "/methods/:payment_method_id",
            delete(methods::id::delete::handler),
        )
        //
        // Webhook
        //
        .route("/webhook", post(webhook::post::handler))
        // for later
        // .layer(middleware::from_fn_with_state(app_state.clone(), crate::middleware::auth::auth_middleware))
        .with_state(app_state)
}
