use crate::state::AppState;

use {axum::routing::get, axum::Router, std::sync::Arc};

pub mod me;

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /users
    Router::new()
        .route("/@me", get(me::get::handler))
        .with_state(app_state)
}
