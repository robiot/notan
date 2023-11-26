use crate::{error::{Result, Error}, state::AppState};

use super::Response;

use {axum::extract::State, std::sync::Arc};

pub async fn handler(State(_state): State<Arc<AppState>>) -> Result<Response<String>> {
    Err(Error::NotFound)
}
