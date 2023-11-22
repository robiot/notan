use crate::state::AppState;

use {axum::routing::post, axum::Router, std::sync::Arc};

pub mod login;
pub mod renew;
pub mod signup;
pub mod verify_code;

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /auth
    Router::new()
        .route("/login", post(login::handler))
        .route("/renew", post(renew::handler))
        .route("/signup", post(signup::handler))
        .route("/verify_code", post(verify_code::handler))
        .with_state(app_state)
}
