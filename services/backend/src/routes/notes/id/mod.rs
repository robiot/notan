use serde::Deserialize;

pub mod delete;
pub mod get;
pub mod put;

#[derive(Deserialize)]
pub struct NoteIdParams {
    pub id: String,
}
