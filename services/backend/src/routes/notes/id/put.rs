use axum::Json;

use crate::{
    auth::check_auth,
    error::{Result, Error},
    routes::{notes::NoteDataBody, Response, ResponseError},
    schemas,
    state::AppState,
    utils::{
        database::tags::connect_tags_to_note,
        limits,
        validation::{validate_note_body, validate_title, validate_url, validate_url_usage},
    },
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
    Json(body): Json<NoteDataBody>,
) -> Result<Response<String>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let limits = limits::get_limits(id.clone(), state.clone()).await?;

    validate_title(body.title.clone())?;
    validate_note_body(body.note.clone(), limits.clone())?;
    validate_url(body.url.clone())?;

    validate_url_usage(body.url.clone(), limits.clone(), id.clone(), &state).await?;


    // check if user is above limit
    let count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM public.notes WHERE user_id = $1;
        "#,
    )
    .bind(id.clone())
    .fetch_one(&state.db)
    .await?;

    if count > limits.max_note_storage as i64 {
        return Err(Error::BadRequest(ResponseError {
            message: "You are above your current limit".to_string(),
            name: "above_limit".to_string(),
        }));
    }

    // update
    let note = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>(
        r#"
        UPDATE public.notes
        SET title = $1, url = $2, note = $3, remind_at = $4
        WHERE id = $5 and user_id = $6
        RETURNING *;
        "#,
    )
    .bind(body.title.clone())
    .bind(body.url.clone())
    .bind(body.note.clone())
    .bind(body.remind_at.clone())
    .bind(params.id.clone())
    .bind(id.clone())
    .fetch_one(&state.db)
    .await?;

    // delete note_tags relation
    sqlx::query("DELETE FROM public.note_tags WHERE note_id = $1")
        .bind(&params.id)
        .execute(&state.db)
        .await?;

    // connect tags to note
    connect_tags_to_note(note.id.clone(), body.tags.clone(), &state.db).await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
