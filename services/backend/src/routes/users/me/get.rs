use hyper::StatusCode;

use crate::{
    auth::check_auth,
    error::Result,
    routes::Response,
    schemas,
    state::AppState,
    utils::{database::notes::get_note_count, limits},
};

use {axum::extract::State, hyper::HeaderMap, serde::Serialize, std::sync::Arc};

#[derive(Serialize)]
pub struct UserGetResponse {
    id: String,
    verified_mail: bool,
    username: Option<String>,
    email: String,

    // google
    is_connected_google: bool,

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

    let note_count = get_note_count(id.clone(), &state.db).await?;

    // get optional google connection
    let google_connection = sqlx::query_as::<
        sqlx::Postgres,
        schemas::user_google_connection::UserGoogleConnection,
    >(r#"SELECT * FROM public.user_google_connections WHERE user_id = $1"#)
    .bind(id.clone())
    .fetch_optional(&state.db)
    .await?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(UserGetResponse {
            id: user.id,
            email: user.email,
            username: user.username,
            verified_mail: user.verified_mail,

            // google
            is_connected_google: google_connection.is_some(),

            // limits
            total_note_storage: limits.max_notes,
            used_note_storage: note_count,
            max_note_length: limits.max_note_characters,
            has_unlimited_notes_per_domain: limits.no_domain_restrictions,
        }),
    ))
}
