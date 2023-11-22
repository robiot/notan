use crate::error::Result;

use super::Response;

use {
    crate::state::AppState, axum::extract::State, hyper::StatusCode, serde::Serialize,
    std::sync::Arc,
};

#[derive(Serialize)]
pub struct RootResponse {
    pub message: String,
}

pub async fn handler(State(_state): State<Arc<AppState>>) -> Result<Response<RootResponse>> {
    Ok(Response::new_success(
        StatusCode::OK,
        Some(RootResponse {
            message: "Notan API online 🚀".to_string(),
        }),
    ))
}
