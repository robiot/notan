use serde::{Deserialize, Serialize};
use sqlx::types::chrono;

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub user_id: String,
    pub title: String,
    pub url: String,
    pub note: String,
    pub remind_at: Option<chrono::DateTime<chrono::Utc>>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}
