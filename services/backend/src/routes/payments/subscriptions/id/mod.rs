use serde::Deserialize;

pub mod subscribe;
pub mod cancel;

#[derive(Deserialize)]
pub struct SubscriptionsIdParams {
    pub product_id: String,
}
