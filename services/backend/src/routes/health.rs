use hyper::StatusCode;

use crate::error::Result;

use super::{root::RootResponse, Response};

use {crate::state::AppState, axum::extract::State, std::sync::Arc};

pub async fn handler(State(_state): State<Arc<AppState>>) -> Result<Response<RootResponse>> {
    Ok(Response::new_success(StatusCode::OK, None))
}
