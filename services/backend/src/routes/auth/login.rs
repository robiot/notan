use crate::{
    error::{Error, Result},
    jwt,
    routes::Response,
    schemas,
    state::AppState,
};

use {
    argon2::{Argon2, PasswordHash, PasswordVerifier},
    axum::{extract::State, Json},
    hyper::{HeaderMap, StatusCode},
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct LoginBody {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    token: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    _headers: HeaderMap,
    Json(body): Json<LoginBody>,
) -> Result<Response<LoginResponse>> {
    let user = match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE email = $1"#,
    )
    .bind(body.email.clone())
    .fetch_one(&state.db)
    .await
    {
        Ok(user) => user,
        Err(error) => {
            if let sqlx::Error::RowNotFound = error {
                log::trace!("User not found: {}", body.email);
                return Err(Error::Unauthorized);
            } else {
                return Err(error.into());
            }
        }
    };

    let db_hash = match PasswordHash::new(&user.password) {
        Ok(hash) => hash,
        Err(_) => return Err(Error::InternalServerError),
    };

    // Check password using argon2
    if Argon2::default()
        .verify_password(body.password.as_bytes(), &db_hash)
        .is_err()
    {
        log::trace!("Invalid password for user: {}", body.email);
        return Err(Error::Unauthorized);
    }

    let token = jwt::user::User::generate(&user.id, &state.config.jwt_secret)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(LoginResponse { token }),
    ))
}
