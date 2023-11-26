use {
    axum::response::{IntoResponse, Response},
    hyper::StatusCode,
};

use crate::routes::{self, ResponseError};

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("This should not have occurred")]
    InternalServerError,

    #[error(transparent)]
    Envy(#[from] envy::Error),

    #[error(transparent)]
    Database(#[from] sqlx::Error),

    #[error(transparent)]
    HttpRequest(#[from] reqwest::Error),

    #[error(transparent)]
    Json(#[from] serde_json::Error),

    #[error(transparent)]
    ParseError(#[from] oauth2::url::ParseError),

    #[error(transparent)]
    ComponentRageError(#[from] time::error::ComponentRange),

    #[error(transparent)]
    JsonWebTokenError(#[from] jsonwebtoken::errors::Error),

    #[error(transparent)]
    RusotoTlsError(#[from] rusoto_core::request::TlsError),

    #[error(transparent)]
    RusotoCreateBucketError(#[from] rusoto_core::RusotoError<rusoto_s3::CreateBucketError>),

    #[error(transparent)]
    RusotoPutObjectError(#[from] rusoto_core::RusotoError<rusoto_s3::PutObjectError>),

    #[error(transparent)]
    MultipartError(#[from] axum::extract::multipart::MultipartError),

    #[error(transparent)]
    RedisConnectError(#[from] redis::RedisError),

    #[error("Multipart is missing files")]
    MultiPartMissingFiles,

    #[error("Multipart is missing a filename")]
    MultiPartMissingName,

    #[error("Could not reach an external endpoint")]
    CouldNotReachExternalEndpoint,

    #[error("User does not exist")]
    UserDoesNotExist,

    // Generic errors
    #[error("Not found")]
    NotFound,

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Invalid token type")]
    InvalidTokenType,

    #[error("Invalid scope")]
    InvalidScope,

    #[error("error in the request body")]
    UnprocessableEntity(ResponseError),
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        log::error!("responding with error ({:?})", self);
        match self {
            Error::Database(sqlx::Error::RowNotFound) | Error::NotFound => {
                routes::Response::new_failure(
                    StatusCode::NOT_FOUND,
                    vec![ResponseError {
                        name: "not_found".to_string(),
                        message: "Not found".to_string(),
                    }],
                )
            }
            Error::MultiPartMissingName => routes::Response::new_failure(
                StatusCode::BAD_GATEWAY,
                vec![ResponseError {
                    name: "missing_name".to_string(),
                    message: "Missing name for file".to_string(),
                }],
            ),
            Error::MultiPartMissingFiles => routes::Response::new_failure(
                StatusCode::BAD_GATEWAY,
                vec![ResponseError {
                    name: "missing_files".to_string(),
                    message: "Missing files".to_string(),
                }],
            ),
            Error::UserDoesNotExist => routes::Response::new_failure(
                StatusCode::NOT_FOUND,
                vec![ResponseError {
                    name: "user_not_found".to_string(),
                    message: "User was not found".to_string(),
                }],
            ),
            Error::Unauthorized => routes::Response::new_failure(
                StatusCode::UNAUTHORIZED,
                vec![ResponseError {
                    name: "unauthorized".to_string(),
                    message: "Unauthorized".to_string(),
                }],
            ),
            Error::UnprocessableEntity(identifier) => {
                routes::Response::new_failure(StatusCode::UNPROCESSABLE_ENTITY, vec![identifier])
            }
            _ => routes::Response::new_failure(
                StatusCode::INTERNAL_SERVER_ERROR,
                vec![ResponseError {
                    name: "unknown_error".to_string(),
                    message: "This error should not have occurred. Please fix it yourself."
                        .to_string(),
                }],
            ),
        }
        .into_response()
    }
}
