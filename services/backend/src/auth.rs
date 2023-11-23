use std::sync::Arc;

use crate::{
    error::{self, Error},
    jwt, schemas,
    state::AppState,
};

use hyper::{header, HeaderMap};

pub fn get_jwt_from_headers(headers: HeaderMap) -> Option<String> {
    headers
        .get(header::AUTHORIZATION)
        .and_then(|auth_header| auth_header.to_str().ok())
        .and_then(|auth_value| {
            if auth_value.starts_with("Bearer ") {
                Some(auth_value[7..].to_owned())
            } else {
                None
            }
        })
}

pub async fn check_auth_unverified_email_allowed(
    headers: HeaderMap,
    state: Arc<AppState>,
) -> error::Result<String> {
    let config = &state.config;
    let jwt = match get_jwt_from_headers(headers.clone()) {
        Some(jwt) => jwt,
        None => {
            return Err(Error::Unauthorized);
        }
    };

    let token_data = match jwt::user::User::decode(&jwt, &config.jwt_secret) {
        Ok(token_data) => token_data,
        Err(_) => {
            return Err(Error::Unauthorized);
        }
    };

    // check if exists in db
    match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(token_data.id.clone())
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

    Ok(token_data.id)
}

/// Checks if the request is authenticated.
///
/// If the request is authenticated, returns the user id.
///
/// If the request is not authenticated, returns an error.
pub async fn check_auth(headers: HeaderMap, state: Arc<AppState>) -> error::Result<String> {
    let id = check_auth_unverified_email_allowed(headers.clone(), state.clone()).await?;

    return Ok(id);
    // check if exists in db
    // match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
    //     r#"SELECT * FROM public.users WHERE id = $1"#,
    // )
    // .bind(token_data.id.clone())
    // .fetch_one(&state.db)
    // .await
    // {
    //     Ok(user) => user,
    //     Err(error) => {
    //         if let sqlx::Error::RowNotFound = error {
    //             return Err(Error::Unauthorized);
    //         } else {
    //             return Err(error.into());
    //         }
    //     }
    // };

    // Ok(token_data.id)
}
