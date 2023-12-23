use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{Response, ResponseError},
    schemas,
    state::AppState,
    utils::{
        database::{tags::connect_tags_to_note, notes::get_note_count},
        limits,
        validation::{validate_note_body, validate_title, validate_url, validate_url_usage},
    },
};

use super::NoteDataBody;

use {axum::extract::State, axum::Json, hyper::HeaderMap, hyper::StatusCode, std::sync::Arc};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<NoteDataBody>,
) -> Result<Response<bool>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let limits = limits::get_limits(id.clone(), state.clone()).await?;

    validate_title(body.title.clone())?;
    validate_note_body(body.note.clone(), limits.clone())?;
    validate_url(body.url.clone())?;

    validate_url_usage(body.url.clone(), limits.clone(), id.clone(), &state).await?;

    let count = get_note_count(id.clone(), &state.db).await?;

    if count >= limits.max_note_storage as i64 {
        return Err(Error::BadRequest(ResponseError {
            message: "Limit has been reached".to_string(),
            name: "max_notes".to_string(),
        }));
    }

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
