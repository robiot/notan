use std::net::SocketAddr;

use crate::{
    error::{Error, Result},
    jwt,
    routes::Response,
    schemas,
    state::AppState,
    utils::{self, validation},
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
    headers: HeaderMap,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(body): Json<SignupBody>,
) -> Result<Response<SignupResponse>> {
    let username = body.username.clone().to_lowercase();
    let email = body.email.clone().to_lowercase();

    validation::validate_password(body.password.clone())?;
    validation::validate_username(username.clone())?;
    validation::validate_email(email.clone())?;

    utils::database::user::check_username_taken(username.clone(), &state.db).await?;
    utils::database::user::check_email_taken(email.clone(), &state.db).await?;

    let salt = SaltString::generate(&mut OsRng);

    // Argon2 with default params (Argon2id v19)
    let argon2 = Argon2::default();

    let password_hash = match argon2.hash_password(body.password.as_bytes(), &salt) {
        Ok(hash) => hash.to_string(),
        Err(_) => return Err(Error::InternalServerError),
    };

    let ip_from_cf = headers
        .get("CF-Connecting-IP");

    let ip = match ip_from_cf {
        Some(ip) => match ip.to_str() {
            Ok(ip) => ip.to_string(),
            Err(_) => addr.ip().to_string(),
        },
        None => addr.ip().to_string(),
    };

    let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"
        INSERT INTO public.users (verified_mail, username, email, password, ip)
        VALUES (false, $1, $2, $3, $4)
        RETURNING *;
        "#,
    )
    .bind(username.clone())
    .bind(email.clone())
    .bind(password_hash)
    .bind(ip.clone())
    .fetch_one(&state.db)
    .await?;

    let token = jwt::user::User::generate(&user.id, &state.config.jwt_secret)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(SignupResponse { token }),
    ))
}
