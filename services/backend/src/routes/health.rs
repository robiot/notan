use {
    crate::state::AppState,
    axum::Json,
    axum::{extract::State as State, response::IntoResponse},
    serde::Serialize,
    std::sync::Arc,
};

#[derive(Serialize)]
pub struct RootResponse {
    pub success: bool,
}

pub async fn handler(State(_state): State<Arc<AppState>>) -> impl IntoResponse {
    Json(RootResponse { success: true })
}
