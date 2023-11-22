use crate::{auth::check_auth, error::Result, jwt, routes::Response, state::AppState};

use {
    axum::extract::State,
    hyper::{HeaderMap, StatusCode},
    serde::Serialize,
    std::sync::Arc,
};

#[derive(Serialize)]
pub struct RenewResponse {
    token: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<RenewResponse>> {
    let config = &state.config;

    let id = check_auth(headers.clone(), state.clone()).await?;

    let token = jwt::user::User::generate(&id, &config.jwt_secret)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(RenewResponse { token }),
    ))
}
