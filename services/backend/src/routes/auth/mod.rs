use crate::state::AppState;

use {axum::routing::post, axum::Router, std::sync::Arc};

pub mod login;
pub mod renew;
pub mod oauth;
pub mod signup;

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /auth
    Router::new()
        .route("/login", post(login::handler))
        .route("/renew", post(renew::handler))
        .route("/signup", post(signup::handler))
        .route("/oauth/google", post(oauth::google::handler))
        .with_state(app_state)
}
