use argon2::password_hash::SaltString;
use rand::rngs::OsRng;

use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::Response,
    schemas,
    state::AppState,
    utils::validation,
};

use {
    argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier},
    axum::{extract::State, Json},
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct UserUsernameBody {
    pub current_password: String,
    pub new_password: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<UserUsernameBody>,
) -> Result<Response<bool>> {
    validation::validate_password(body.new_password.clone())?;

    let id = check_auth(headers.clone(), state.clone()).await?;

    let user = match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(id.clone())
    .fetch_one(&state.db)
    .await
    {
        Ok(user) => user,
        Err(error) => {
            if let sqlx::Error::RowNotFound = error {
                return Err(Error::Unauthorized);
            } else {
                return Err(error.into());
            }
        }
    };

    let current_password_hash = match PasswordHash::new(&user.password) {
        Ok(hash) => hash,
        Err(_) => return Err(Error::InternalServerError),
    };

    // Check password using argon2
    if Argon2::default()
        .verify_password(body.current_password.as_bytes(), &current_password_hash)
        .is_err()
    {
        return Err(Error::Unauthorized);
    }

    // Old password is correct, generate new hash

    let new_password_hash = match Argon2::default().hash_password(
        body.new_password.as_bytes(),
        &SaltString::generate(&mut OsRng),
    ) {
        Ok(hash) => hash.to_string(),
        Err(_) => return Err(Error::InternalServerError),
    };

    sqlx::query(r#"UPDATE public.users SET password = $1 WHERE id = $2"#)
        .bind(new_password_hash.clone())
        .bind(id.clone())
        .execute(&state.db)
        .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
