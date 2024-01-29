use crate::state::AppState;

use {
    axum::routing::{delete, get, put, post},
    axum::Router,
    std::sync::Arc,
    serde::{Deserialize, Serialize},
    sqlx::types::chrono::Utc
};

pub mod get;
pub mod post;
pub mod id;

#[derive(Serialize)]
pub struct NotesGetResponseItem {
    pub id: String,
    pub title: String,
    pub url: Option<String>,
    pub note: String,
    pub tags: Vec<String>,
    pub remind_at: Option<sqlx::types::chrono::DateTime<Utc>>,
    pub created_at: sqlx::types::chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct NoteDataBody {
    pub title: String,
    pub url: Option<String>,
    pub note: String,
    pub tags: Vec<String>,
    pub remind_at: Option<sqlx::types::chrono::DateTime<Utc>>,
}

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /notes
    Router::new()
        .route("/", get(get::handler))
        .route("/", post(post::handler))
        .route("/:id", delete(id::delete::handler))
        .route("/:id", get(id::get::handler))
        .route("/:id", put(id::put::handler))
        .with_state(app_state)
}
