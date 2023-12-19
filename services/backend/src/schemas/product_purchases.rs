use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct ProductPurchase {
    pub id: String,
    pub user_id: String,
    pub stripe_product_id: String,
    pub bought_at: chrono::DateTime<chrono::Utc>,
}
