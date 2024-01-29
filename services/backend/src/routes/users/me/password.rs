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
    // if user has no password, current_password is None
    pub current_password: Option<String>,
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

    if let Some(password) = user.password {
        // check if user has password provided in body
        if let Some(current_password_input) = body.current_password.clone() {
            let current_password_hash = match PasswordHash::new(&password) {
                Ok(hash) => hash,
                Err(_) => return Err(Error::InternalServerError),
            };

            // Check password using argon2
            if Argon2::default()
                .verify_password(current_password_input.as_bytes(), &current_password_hash)
                .is_err()
            {
                return Err(Error::Unauthorized);
            }
        } else {
            return Err(Error::Unauthorized);
        }
    } else {
        // User has no password, set new password
        // this often occurs when the user is created with google oauth

        // remove the google connection
        sqlx::query(r#"DELETE FROM public.user_google_connections WHERE user_id = $1"#)
            .bind(id.clone())
            .execute(&state.db)
            .await?;
    }

    // here the user has no password, or the password is correct
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
