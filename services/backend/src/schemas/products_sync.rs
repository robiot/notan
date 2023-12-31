use serde::{Deserialize, Serialize};
use sqlx::types::chrono;

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct ProductsSync {
    pub id: String,
    pub hash: String,
    pub installed_at: chrono::DateTime<chrono::Utc>,
}
