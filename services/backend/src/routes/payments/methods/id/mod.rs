use serde::Deserialize;

pub mod post;
pub mod delete;

#[derive(Deserialize)]
pub struct PaymentMethodIdParams {
    pub payment_method_id: String,
}
