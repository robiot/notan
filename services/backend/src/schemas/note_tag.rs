use serde::{Deserialize, Serialize};
use sqlx::types::chrono;

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct NoteTag {
    pub id: String,
    pub note_id: String,
    pub tag_id: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}
