use crate::{
    auth::check_auth,
    error::Result,
    routes::{notes::NotesGetResponseItem, Response},
    schemas,
    state::AppState,
    utils::database::tags::get_all_tags_for_note,
};

use {
    axum::extract::{Path, State},
    hyper::{HeaderMap, StatusCode},
    std::sync::Arc,
};

use super::NoteIdParams;

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<NoteIdParams>,
    headers: HeaderMap,
) -> Result<Response<NotesGetResponseItem>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    // get note from db
    let note = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>(
        "SELECT * FROM public.notes WHERE id = $1 and user_id = $2",
    )
    .bind(&params.id)
    .bind(&id)
    .fetch_one(&state.db)
    .await?;

    let tags = get_all_tags_for_note(note.id.clone(), &state.db).await?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(NotesGetResponseItem {
            id: note.id,
            title: note.title,
            url: note.url,
            note: note.note,
            tags,
            remind_at: note.remind_at,
            created_at: note.created_at,
        }),
    ))
}
