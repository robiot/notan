use crate::state::AppState;

use {
    axum::routing::{delete, get, post},
    axum::Router,
    std::sync::Arc,
};

pub mod get;
pub mod post;
pub mod id;

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /notes
    Router::new()
        .route("/", get(get::handler))
        .route("/", post(post::handler))
        .route("/:id", delete(id::delete::handler))
        .with_state(app_state)
}
