use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct StripePriceCurrency {
    pub id: String,
    pub stripe_price_id: String,
    pub currency: String,
    pub price: i64,
}
