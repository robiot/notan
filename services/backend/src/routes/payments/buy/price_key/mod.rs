use serde::{Deserialize, Serialize};

pub mod subscribe;

#[derive(Deserialize)]
pub struct BuyIdParams {
    pub price_key: String,
}

#[derive(Serialize, Deserialize)]
pub struct PaymentMethodRequiredBody {
    // card has to be created before
    pub payment_method_id: String,
}
