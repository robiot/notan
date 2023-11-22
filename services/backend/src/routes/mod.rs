use axum::{response::IntoResponse, Json};
use hyper::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

pub mod health;
pub mod root;
pub mod auth;

#[derive(Serialize)]
#[serde(rename_all = "UPPERCASE")]
pub enum ResponseStatus {
    Success,
    Failure,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ResponseError {
    pub name: String,
    pub message: String,
}

#[derive(Serialize)]
pub struct Response<T> {
    pub status: ResponseStatus,
    #[serde(skip_serializing)]
    pub status_code: StatusCode,
    pub errors: Option<Vec<ResponseError>>,
    pub data: Option<T>,
}

// Non-generic variant for errors
pub type ErrorResponse = Response<serde_json::Value>;

impl ErrorResponse {
    pub fn new_failure(status: StatusCode, errors: Vec<ResponseError>) -> Self {
        Response {
            status: ResponseStatus::Failure,
            status_code: status,
            errors: Some(errors),
            data: None,
        }
    }
}

// Implementations for the generic Response struct
impl<T> Response<T>
where
    T: Serialize,
{
    pub fn new_success(status: StatusCode, data: Option<T>) -> Self {
        Response {
            status: ResponseStatus::Success,
            status_code: status,
            errors: None,
            data,
        }
    }
}

impl<T> IntoResponse for Response<T>
where
    T: Serialize,
{
    fn into_response(self) -> axum::response::Response {
        let status = self.status_code;
        let json: Json<Value> = self.into();

        (status, json).into_response()
    }
}

impl<T> From<Response<T>> for Json<Value>
where
    T: Serialize,
{
    fn from(value: Response<T>) -> Self {
        Json(json!(value))
    }
}

impl<T> Default for Response<T>
where
    T: serde::Serialize,
{
    fn default() -> Self {
        Response::new_success(StatusCode::OK, None)
    }
}
