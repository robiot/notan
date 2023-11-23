use hyper::StatusCode;

use crate::{auth::check_auth, error::Result, routes::Response, schemas};

use {
    crate::state::AppState, axum::extract::State, hyper::HeaderMap, serde::Serialize,
    std::sync::Arc,
};

#[derive(Serialize)]
pub struct UserGetResponse {
    id: String,
    verified_mail: bool,
    username: String,
    email: String,
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

    Ok(Response::new_success(
        StatusCode::OK,
        Some(UserGetResponse {
            id: user.id,
            email: user.email,
            username: user.username,
            verified_mail: user.verified_mail,
        }),
    ))
}
