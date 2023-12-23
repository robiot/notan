pub mod version;

use crate::state::AppState;

use {axum::routing::get, axum::Router, std::sync::Arc};

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /updates
    Router::new()
        .route("/version", get(version::handler))
        .with_state(app_state)
}
