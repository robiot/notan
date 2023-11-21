use std::sync::Arc;

use crate::{
    error::{self, Error},
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

pub async fn check_auth(_headers: HeaderMap, _state: Arc<AppState>) -> bool {
    true
}

pub async fn use_auth(headers: HeaderMap, state: Arc<AppState>) -> error::Result<()> {
    if check_auth(headers, state).await == false {
        return Err(Error::Unauthorized);
    }

    Ok(())
}
