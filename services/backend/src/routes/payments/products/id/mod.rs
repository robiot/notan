use serde::Deserialize;

pub mod buy;

#[derive(Deserialize)]
pub struct ProductsIdParams {
    pub product_id: String,
}
