use serde::Deserialize;

pub mod get_purchases;

#[derive(Deserialize)]
pub struct ProductsIdParams {
    pub product_id: String,
}
