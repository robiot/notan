use crate::{
    error::{Error, Result},
    routes::ResponseError,
    schemas,
    state::AppState,
};

use {
    argon2::{password_hash::SaltString, Argon2, PasswordHasher},
    hyper::HeaderMap,
    rand::rngs::OsRng,
    sqlx::{Pool, Postgres},
    std::net::SocketAddr,
    std::sync::Arc,
};

// Check if user already exists with username
pub async fn check_username_taken(username: String, pool: &Pool<Postgres>) -> Result<()> {
    match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE username = $1"#,
    )
    .bind(username.clone())
    .fetch_optional(pool)
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

    Ok(())
}

// Check if user already exists with email
pub async fn check_email_taken(email: String, pool: &Pool<Postgres>) -> Result<()> {
    match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE email = $1"#,
    )
    .bind(email.clone())
    .fetch_optional(pool)
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

    Ok(())
}

#[derive(Clone)]
pub struct CreateUser {
    pub email: String,
    pub username: Option<String>,
    pub password: Option<String>,
    pub name: Option<String>,
    pub verified_mail: Option<bool>,

    // info
    pub state: Arc<AppState>,
    pub addr: SocketAddr,
    pub headers: HeaderMap,
}

pub async fn create_user(user: CreateUser) -> Result<schemas::user::User> {
    let ip_from_cf = user.headers.get("CF-Connecting-IP");

    let ip = match ip_from_cf {
        Some(ip) => match ip.to_str() {
            Ok(ip) => ip.to_string(),
            Err(_) => user.addr.ip().to_string(),
        },
        None => user.addr.ip().to_string(),
    };

    let password_hash = if let Some(password) = user.password {
        let salt = SaltString::generate(&mut OsRng);

        // Argon2 with default params (Argon2id v19)
        let argon2 = Argon2::default();

        let password_hash = match argon2.hash_password(password.as_bytes(), &salt) {
            Ok(hash) => hash.to_string(),
            Err(_) => return Err(Error::InternalServerError),
        };

        Some(password_hash)
    } else {
        None
    };

    let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"
        INSERT INTO public.users (verified_mail, username, email, password, ip, name)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
        "#,
    )
    .bind(user.verified_mail.unwrap_or(false))
    .bind(user.username.clone())
    .bind(user.email.clone())
    .bind(password_hash)
    .bind(ip.clone())
    .bind(user.name.clone())
    .fetch_one(&user.state.db)
    .await?;

    Ok(user)
}

// pub async fn get_user_by_id(id: String, pool: &Pool<Postgres>) -> Result<schemas::user::User> {
//     let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
//         r#"SELECT * FROM public.users WHERE id = $1"#,
//     )
//     .bind(id.clone())
//     .fetch_one(pool)
//     .await?;

//     Ok(user)
// }
