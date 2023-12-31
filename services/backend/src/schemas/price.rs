use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct Price {
    pub price_key: String,
    pub stripe_price_id: String,
}
