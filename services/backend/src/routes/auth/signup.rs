use std::net::SocketAddr;

use crate::{
    error::{Error, Result},
    jwt,
    routes::{Response, ResponseError},
    schemas,
    state::AppState, utils::validation,
};

use {
    argon2::{password_hash::SaltString, Argon2, PasswordHasher},
    axum::{
        extract::{ConnectInfo, State},
        Json,
    },
    hyper::{HeaderMap, StatusCode},
    rand::rngs::OsRng,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct SignupBody {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct SignupResponse {
    token: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    _headers: HeaderMap,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(body): Json<SignupBody>,
) -> Result<Response<SignupResponse>> {
    validation::validate_password(body.password.clone())?;
    validation::validate_username(body.username.clone())?;
    validation::validate_email(body.email.clone())?;

    // Check if user already exists with email
    match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE email = $1"#,
    )
    .bind(body.email.clone())
    .fetch_optional(&state.db)
    .await
    {
        Ok(user) => {
            if user.is_some() {
                return Err(Error::UnprocessableEntity(ResponseError {
                    message: "Another account with this mail already exists".to_string(),
                    name: "email_exists".to_string(),
                }));
            }
        }
        Err(error) => return Err(error.into()),
    };

    // Check if user already exists with username
    match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE username = $1"#,
    )
    .bind(body.username.clone())
    .fetch_optional(&state.db)
    .await
    {
        Ok(user) => {
            if user.is_some() {
                return Err(Error::UnprocessableEntity(ResponseError {
                    message: "Another account with this username already exists".to_string(),
                    name: "username_exists".to_string(),
                }));
            }
        }
        Err(error) => return Err(error.into()),
    };

    let salt = SaltString::generate(&mut OsRng);

    // Argon2 with default params (Argon2id v19)
    let argon2 = Argon2::default();

    let password_hash = match argon2.hash_password(body.password.as_bytes(), &salt) {
        Ok(hash) => hash.to_string(),
        Err(_) => return Err(Error::InternalServerError),
    };

    let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"
        INSERT INTO public.users (verified_mail, username, email, password, ip)
        VALUES (false, $1, $2, $3, $4)
        RETURNING *;
        "#,
    )
    .bind(body.username.clone())
    .bind(body.email.clone())
    .bind(password_hash)
    .bind(addr.ip().to_string())
    .fetch_one(&state.db)
    .await?;

    let token = jwt::user::User::generate(&user.id, &state.config.jwt_secret)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(SignupResponse {
            token,
        }),
    ))
}
