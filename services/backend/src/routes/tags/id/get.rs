use crate::{
    auth::check_auth,
    error::Result,
    routes::{tags::TagsGetResponseItem, Response},
    schemas,
    state::AppState,
};

use super::TagIdParams;

use {
    axum::extract::{Path, State},
    hyper::{HeaderMap, StatusCode},
    std::sync::Arc,
};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<TagIdParams>,
    headers: HeaderMap,
) -> Result<Response<TagsGetResponseItem>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let tag = sqlx::query_as::<sqlx::Postgres, schemas::tag::Tag>(
        r#"SELECT * FROM public.tags WHERE id = $1 and user_id = $2"#,
    )
    .bind(&params.id)
    .bind(id.clone())
    .fetch_one(&state.db)
    .await?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(TagsGetResponseItem {
            id: tag.id,
            color: tag.color,
            name: tag.name,
            created_at: tag.created_at,
        }),
    ))
}
