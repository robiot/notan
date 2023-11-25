use hyper::HeaderMap;
use sqlx::types::chrono::Utc;

use crate::{
    auth::check_auth,
    error::Result,
    routes::Response,
    schemas::{self, tag},
    state::AppState,
};

use {axum::extract::State, hyper::StatusCode, serde::Serialize, std::sync::Arc};

#[derive(Serialize)]
pub struct TagItem {
    pub id: String,
    pub name: String,
}

#[derive(Serialize)]
pub struct NotesGetResponseItem {
    pub id: String,
    pub title: String,
    pub url: String,
    pub note: String,
    pub tags: Vec<TagItem>,
    pub remind_at: Option<sqlx::types::chrono::DateTime<Utc>>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<Vec<NotesGetResponseItem>>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let mut result: Vec<NotesGetResponseItem> = Vec::new();

    let notes = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>(
        r#"SELECT * FROM public.notes WHERE user_id = $1"#,
    )
    .bind(id.clone())
    .fetch_all(&state.db)
    .await?;

    for note in notes {
        let mut tags: Vec<TagItem> = Vec::new();

        let tags_for_note = sqlx::query_as::<sqlx::Postgres, schemas::note_tag::NoteTag>(
            r#"SELECT * FROM public.note_tags WHERE note_id = $1"#,
        )
        .bind(note.id.clone())
        .fetch_all(&state.db)
        .await?;

        for tag_for_note in tags_for_note {
            let tag = sqlx::query_as::<sqlx::Postgres, tag::Tag>(
                r#"SELECT * FROM public.tags WHERE id = $1"#,
            )
            .bind(tag_for_note.tag_id.clone())
            .fetch_one(&state.db)
            .await?;

            tags.push(TagItem {
                id: tag.id,
                name: tag.name,
            })
        }

        result.push(NotesGetResponseItem {
            id: note.id,
            title: note.title,
            url: note.url,
            note: note.note,
            tags,
            remind_at: note.remind_at,
        })
    }

    Ok(Response::new_success(StatusCode::OK, Some(result)))
}
