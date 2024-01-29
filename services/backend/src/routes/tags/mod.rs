use crate::state::AppState;

use {
    axum::routing::{delete, get, post, patch},
    axum::Router,
    serde::{Deserialize, Serialize},
    sqlx::types::chrono,
    std::sync::Arc,
};

pub mod get;
pub mod id;
pub mod post;

#[derive(Serialize)]
pub struct TagItem {
    pub id: String,
    pub name: String,
}

#[derive(Serialize)]
pub struct TagsGetResponseItem {
    pub id: String,
    pub name: String,
    pub color: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct TagDataBody {
    pub name: String,
}

pub fn router(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    // /tags
    Router::new()
        .route("/", get(get::handler))
        .route("/", post(post::handler))
        .route("/:id", delete(id::delete::handler))
        .route("/:id", patch(id::patch::handler))
        .route("/:id", get(id::get::handler))
        .with_state(app_state)
}
