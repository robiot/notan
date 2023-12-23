use crate::{
    auth::check_auth, error::Result, routes::Response, state::AppState,
};

use {
    axum::extract::State,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct GetVersionsResponse {
    pub required_version: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<GetVersionsResponse>> {
    check_auth(headers.clone(), state.clone()).await?;

    Ok(Response::new_success(StatusCode::OK, Some(
        GetVersionsResponse {
            required_version: "1.1.0".to_string(),
        }
    )))
}
