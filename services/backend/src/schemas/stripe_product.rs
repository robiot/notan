use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct StripeProduct {
    pub stripe_product_id: String,
    pub name: String,
    pub max_own: Option<i32>,
    pub storage_increase: Option<i32>,
    pub length_increase: Option<i32>,
    pub unlimited_per_domain: bool,
}
