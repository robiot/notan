use crate::state::AppState;

use {
    axum::routing::{delete, get, post},
    axum::Router,
    std::sync::Arc,
    serde::Serialize,
    sqlx::types::chrono::Utc
};

pub mod get;
pub mod post;
pub mod id;

#[derive(Serialize)]
pub struct TagItem {
    pub id: String,
    pub name: String,
}

#[derive(Serialize)]
pub struct NotesGetResponseItem {
    pub id: String,
    pub title: String,
    pub url: String,
    pub note: String,
    pub tags: Vec<TagItem>,
    pub remind_at: Option<sqlx::types::chrono::DateTime<Utc>>,
}

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /notes
    Router::new()
        .route("/", get(get::handler))
        .route("/", post(post::handler))
        .route("/:id", delete(id::delete::handler))
        .route("/:id", get(id::get::handler))
        .with_state(app_state)
}
