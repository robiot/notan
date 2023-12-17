use serde::Deserialize;

pub mod intent;
pub mod subscribe;

#[derive(Deserialize)]
pub struct BuyIdParams {
    pub price_id: String,
}
