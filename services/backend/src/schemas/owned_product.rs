use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct OwnedProduct {
    pub id: String,
    pub user_id: String,
    pub product_id: String,
    pub bought_at: chrono::DateTime<chrono::Utc>,
}
