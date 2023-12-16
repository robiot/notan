use serde::Deserialize;

pub mod intent;

#[derive(Deserialize)]
pub struct ProductsIdParams {
    pub product_id: String,
}
