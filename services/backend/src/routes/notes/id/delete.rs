use crate::{auth::check_auth, error::{Result, Error}, routes::Response, schemas, state::AppState};

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
) -> Result<Response<bool>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    // get note from db
    let note = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>("SELECT * FROM public.notes WHERE id = $1")
        .bind(&params.id)
        .fetch_one(&state.db)
        .await?;

    // check that note.user_id == id
    if note.user_id != id {
        return Err(Error::Unauthorized);
    }

    // Delete note_tags relation
    sqlx::query("DELETE FROM public.note_tags WHERE note_id = $1")
        .bind(&params.id)
        .execute(&state.db)
        .await?;

    // delete note from db
    sqlx::query("DELETE FROM public.notes WHERE id = $1")
        .bind(&params.id)
        .execute(&state.db)
        .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
