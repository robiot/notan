use hyper::StatusCode;

use crate::error::Result;

use super::Response;

use {crate::state::AppState, axum::extract::State, std::sync::Arc};

pub async fn handler(State(_state): State<Arc<AppState>>) -> Result<Response<String>> {
    Ok(Response::new_success(StatusCode::OK, None))
}
