use crate::{auth::check_auth, error::Result, routes::Response, schemas, state::AppState, utils::database::tags::connect_tags_to_note};

use super::NoteDataBody;

use {axum::extract::State, axum::Json, hyper::HeaderMap, hyper::StatusCode, std::sync::Arc};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<NoteDataBody>,
) -> Result<Response<bool>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let note = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>(
        r#"
        INSERT INTO public.notes (title, url, note, user_id, remind_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        "#,
    )
    .bind(body.title.clone())
    .bind(body.url.clone())
    .bind(body.note.clone())
    .bind(id.clone())
    .bind(body.remind_at.clone())
    .fetch_one(&state.db)
    .await?;

    connect_tags_to_note(note.id.clone(), body.tags.clone(), &state.db).await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
