use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{Response, ResponseError},
    schemas,
    state::AppState,
    utils::{database::tags::get_tags_count, limits, validation::validate_tag_name},
};

use super::TagDataBody;

use {axum::extract::State, axum::Json, hyper::HeaderMap, hyper::StatusCode, std::sync::Arc};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<TagDataBody>,
) -> Result<Response<bool>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    validate_tag_name(body.name.clone())?;

    let limits = limits::get_limits(id.clone(), state.clone()).await?;

    let count = get_tags_count(id.clone(), &state.db).await?;

    if count >= limits.max_tags as i64 {
        return Err(Error::BadRequest(ResponseError {
            message: "Limit has been reached".to_string(),
            name: "max_tags".to_string(),
        }));
    }

    sqlx::query_as::<sqlx::Postgres, schemas::tag::Tag>(
        r#"
        INSERT INTO public.tags (user_id, name, color)
        VALUES ($1, $2 , $3)
        RETURNING *;
        "#,
    )
    .bind(id.clone())
    .bind(body.name.clone())
    .bind("gray".to_string())
    .fetch_one(&state.db)
    .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
