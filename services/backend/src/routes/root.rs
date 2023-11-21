use {
    crate::state::AppState,
    axum::{extract::State, Json},
    serde::Serialize,
    std::sync::Arc,
    axum::response::IntoResponse
};

#[derive(Serialize)]
pub struct RootResponse {
    pub message: String,
}

pub async fn handler(
    State(_state): State<Arc<AppState>>
) -> impl IntoResponse {
    Json(RootResponse { message: "Notan API online 🚀".to_string() })
}
