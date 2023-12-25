use hyper::StatusCode;

use crate::{auth::check_auth, error::Result, routes::Response, schemas, state::AppState, utils::{limits, database::notes::get_note_count}};

use {axum::extract::State, hyper::HeaderMap, serde::Serialize, std::sync::Arc};

#[derive(Serialize)]
pub struct UserGetResponse {
    id: String,
    verified_mail: bool,
    username: String,
    email: String,

    // limits
    used_note_storage: i64,
    total_note_storage: i32,
    max_note_length: i32,
    has_unlimited_notes_per_domain: bool,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<UserGetResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(id.clone())
    .fetch_one(&state.db)
    .await?;

    let limits = limits::get_limits(id.clone(), state.clone()).await?;

    let note_count = get_note_count(id, &state.db).await?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(UserGetResponse {
            id: user.id,
            email: user.email,
            username: user.username,
            verified_mail: user.verified_mail,

            // limits
            total_note_storage: limits.max_note_storage,
            used_note_storage: note_count,
            max_note_length: limits.max_note_length,
            has_unlimited_notes_per_domain: limits.has_unlimited_notes_per_domain,
        }),
    ))
}
