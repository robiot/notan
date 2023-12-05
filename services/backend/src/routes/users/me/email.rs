use crate::{
    auth::check_auth,
    error::Result,
    routes::Response,
    state::AppState,
    utils::{self, validation},
};

use {
    axum::{extract::State, Json},
    hyper::{HeaderMap, StatusCode},
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct UserUsernameBody {
    pub email: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<UserUsernameBody>,
) -> Result<Response<bool>> {
    validation::validate_email(body.email.clone())?;

    let id = check_auth(headers.clone(), state.clone()).await?;

    utils::database::user::check_email_taken(body.email.clone(), &state.db).await?;

    sqlx::query(r#"UPDATE public.users SET email = $1 WHERE id = $2"#)
        .bind(body.email.clone())
        .bind(id.clone())
        .execute(&state.db)
        .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
