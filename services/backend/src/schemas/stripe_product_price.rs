use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct StripeProductPrice {
    pub stripe_product_id: String,
    pub stripe_price_id: String,
}
