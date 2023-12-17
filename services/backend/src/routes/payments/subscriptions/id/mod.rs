use serde::Deserialize;

pub mod cancel;

#[derive(Deserialize)]
pub struct SubscriptionsIdParams {
    pub id: String,
}
