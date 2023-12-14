use serde::Deserialize;

pub mod buy;

#[derive(Deserialize)]
pub struct ProductsIdParams {
    pub id: String,
}
