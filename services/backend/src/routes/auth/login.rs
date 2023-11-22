use crate::{error::Result, routes::Response};

use {
    crate::state::AppState, axum::extract::State, serde::Serialize,
    std::sync::Arc,
};

#[derive(Serialize)]
pub struct XResponse {}

pub async fn handler(State(_state): State<Arc<AppState>>) -> Result<Response<XResponse>> {
    todo!("Implement me! 1");
}
