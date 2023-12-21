use serde::Deserialize;

pub mod get;

#[derive(Deserialize)]
pub struct ProductsIdParams {
    pub product_id: String,
}
