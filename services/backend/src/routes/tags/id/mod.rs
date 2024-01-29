use serde::Deserialize;

pub mod delete;
pub mod patch;
pub mod get;

#[derive(Deserialize)]
pub struct TagIdParams {
    pub id: String,
}
