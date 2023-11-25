use serde::Deserialize;

pub mod delete;

#[derive(Deserialize)]
pub struct NoteIdParams {
    pub id: String,
}
