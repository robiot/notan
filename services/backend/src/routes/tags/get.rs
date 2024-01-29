use crate::{
    auth::check_auth, error::Result, routes::Response, schemas, state::AppState,
};

use super::TagsGetResponseItem;

use {axum::extract::State, hyper::HeaderMap, hyper::StatusCode, std::sync::Arc};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<Vec<TagsGetResponseItem>>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let mut result: Vec<TagsGetResponseItem> = Vec::new();

    let tags = sqlx::query_as::<sqlx::Postgres, schemas::tag::Tag>(
        r#"SELECT * FROM public.tags WHERE user_id = $1"#,
    )
    .bind(id.clone())
    .fetch_all(&state.db)
    .await?;

    for tag in tags {
        result.push(TagsGetResponseItem {
            id: tag.id,
            color: tag.color,
            name: tag.name,
            created_at: tag.created_at,
        })
    }

    Ok(Response::new_success(StatusCode::OK, Some(result)))
}
