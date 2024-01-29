use crate::{auth::check_auth, error::Result, routes::Response, schemas, state::AppState};

use {
    axum::extract::{Path, State},
    hyper::{HeaderMap, StatusCode},
    std::sync::Arc,
};

use super::TagIdParams;

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<TagIdParams>,
    headers: HeaderMap,
) -> Result<Response<bool>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    // check if tag exists for user, otherwise return 404
    sqlx::query_as::<sqlx::Postgres, schemas::tag::Tag>(
        "SELECT * FROM public.tags WHERE id = $1 and user_id = $2",
    )
    .bind(&params.id)
    .bind(&id)
    .fetch_one(&state.db)
    .await?;

    // Delete note_tags relation
    sqlx::query("DELETE FROM public.note_tags WHERE tag_id = $1")
        .bind(&params.id)
        .execute(&state.db)
        .await?;

    // delete tag from db
    sqlx::query("DELETE FROM public.tags WHERE id = $1")
        .bind(&params.id)
        .execute(&state.db)
        .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
