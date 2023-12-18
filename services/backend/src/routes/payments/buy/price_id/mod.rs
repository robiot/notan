use serde::{Serialize, Deserialize};

pub mod intent;
pub mod subscribe;

#[derive(Deserialize)]
pub struct BuyIdParams {
    pub price_id: String,
}

#[derive(Serialize, Deserialize)]
pub struct PaymentMethodRequiredBody {
    // card has to be created before
    pub payment_method_id: String,
}
