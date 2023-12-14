pub mod methods;
pub mod products;
pub mod subscriptions;

use crate::state::AppState;

use {
    axum::routing::{delete, get, post, put},
    axum::Router,
    std::sync::Arc,
};

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /notes
    Router::new()
        .route("/products/:id/buy", get(products::id::buy::handler))
        .with_state(app_state)
}
