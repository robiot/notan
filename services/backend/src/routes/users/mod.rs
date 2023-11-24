use crate::state::AppState;

use {axum::routing::{get, put}, axum::Router, std::sync::Arc};

pub mod me;

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /users
    Router::new()
        .route("/@me", get(me::get::handler))
        .route("/@me/username", put(me::username::handler))
        .route("/@me/email", put(me::email::handler))
        .route("/@me/password", put(me::password::handler))
        .with_state(app_state)
}
