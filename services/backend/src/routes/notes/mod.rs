use crate::state::AppState;

use {
    axum::routing::{get, post},
    axum::Router,
    std::sync::Arc,
};

pub mod get;
pub mod post;

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /notes
    Router::new()
        .route("/", get(get::handler))
        .route("/", post(post::handler))
        .with_state(app_state)
}
