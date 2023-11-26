use serde::Deserialize;

pub mod delete;
pub mod get;

#[derive(Deserialize)]
pub struct NoteIdParams {
    pub id: String,
}
