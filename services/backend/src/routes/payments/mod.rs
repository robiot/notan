pub mod methods;
pub mod products;
pub mod subscriptions;
pub mod webhook;

use crate::state::AppState;

use {
    axum::routing::post,
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
    // /notes
    Router::new()
        .route(
            "/products/:product_id/intent",
            post(products::id::intent::handler),
        )
        .route(
            "/subscriptions/:product_id/subscribe",
            post(subscriptions::id::subscribe::handler),
        )
        .route("/webhook", post(webhook::handler))
        // for later
        // .layer(middleware::from_fn_with_state(app_state.clone(), crate::middleware::auth::auth_middleware))
        .with_state(app_state)
}
