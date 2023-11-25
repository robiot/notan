use crate::state::AppState;

use {axum::routing::get, axum::Router, std::sync::Arc};

pub mod get;

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /notes
    Router::new()
        .route("/", get(get::handler))
        .with_state(app_state)
}
