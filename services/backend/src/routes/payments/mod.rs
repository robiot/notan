pub mod methods;
pub mod products;
pub mod subscriptions;

use axum::middleware;

use crate::state::AppState;

use {
    axum::routing::{delete, get, post, put},
    axum::Router,
    std::sync::Arc,
    serde::{Deserialize, Serialize},
};

#[derive(Serialize, Deserialize)]
pub struct CardActionBody {
    pub card_token: String,
}

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /notes
    Router::new()
        .route("/products/:product_id/buy", post(products::id::buy::handler))
        // for later
        // .layer(middleware::from_fn_with_state(app_state.clone(), crate::middleware::auth::auth_middleware))
        .with_state(app_state)
}
