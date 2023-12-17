pub mod methods;
pub mod products;
pub mod subscriptions;
pub mod webhook;
pub mod buy;
pub mod prices;

use crate::state::AppState;

use {
    axum::routing::{get, post},
    axum::Router,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct CardActionBody {
    pub card_token: String,
}

#[derive(Serialize, Deserialize)]
pub struct IntentResponse {
    pub client_secret: String,
}

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /payments
    Router::new()
        // Buy
        .route(
            "/buy/:price_id/intent",
            post(buy::price_id::intent::handler),
        )
        .route(
            "/buy/:price_id/subscribe",
            post(buy::price_id::subscribe::handler),
        )

        // Subscriptions
        .route(
            "/subscriptions/:id/subscribe",
            post(subscriptions::id::cancel::handler),
        )

        // Products
        .route(
            "/products/:product_id/get_purchases",
            get(products::id::get_purchases::handler),
        )

        // Prices
        .route("/prices", get(prices::get::handler))
        
        // Webhook
        .route("/webhook", post(webhook::handler))
        // for later
        // .layer(middleware::from_fn_with_state(app_state.clone(), crate::middleware::auth::auth_middleware))
        .with_state(app_state)
}
