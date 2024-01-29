use axum::Json;

use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{Response, ResponseError},
    state::AppState,
    utils::{
        database::tags::get_tags_count,
        limits,
        validation::{validate_tag_color, validate_tag_name},
    },
};

use {
    axum::extract::{Path, State},
    hyper::{HeaderMap, StatusCode},
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

use super::TagIdParams;

#[derive(Serialize, Deserialize)]
pub struct TagPutBody {
    pub name: Option<String>,
    pub color: Option<String>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<TagIdParams>,
    headers: HeaderMap,
    Json(body): Json<TagPutBody>,
) -> Result<Response<String>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let limits = limits::get_limits(id.clone(), state.clone()).await?;

    let count = get_tags_count(id.clone(), &state.db).await?;

    if count >= limits.max_tags as i64 {
        return Err(Error::BadRequest(ResponseError {
            message: "Limit has been reached".to_string(),
            name: "max_tags".to_string(),
        }));
    }

    if let Some(name) = body.name.clone() {
        validate_tag_name(name.clone())?;

        sqlx::query(
            r#"
            UPDATE public.tags
            SET name = $1
            WHERE id = $2 AND user_id = $3
            "#,
        )
        .bind(name.clone())
        .bind(params.id.clone())
        .bind(id.clone())
        .execute(&state.db)
        .await?;
    }

    if let Some(color) = body.color.clone() {
        validate_tag_color(color.clone())?;

        sqlx::query(
            r#"
            UPDATE public.tags
            SET color = $1
            WHERE id = $2 AND user_id = $3
            "#,
        )
        .bind(color.clone())
        .bind(params.id.clone())
        .bind(id.clone())
        .execute(&state.db)
        .await?;
    }

    Ok(Response::new_success(StatusCode::OK, None))
}
