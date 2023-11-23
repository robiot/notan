use crate::{error::Result, routes::Response};

use {
    crate::state::AppState, axum::extract::State, serde::Serialize,
    std::sync::Arc,
};

#[derive(Serialize)]
pub struct XResponse {}

pub async fn handler(State(_state): State<Arc<AppState>>) -> Result<Response<XResponse>> {
    todo!("Implement me! 3");
    // Email verify
    // let email_sid = Uuid::new_v4().to_string();
    // let email_token = jwt::email::Email::generate(&email_sid, &state.config.jwt_secret)?;

    // let mut conn_async = state.redis.get_async_connection().await?;

    // // redis lpush to test:sid
    // conn_async
    //     .lpush(
    //         redis_keys::Keys::email_verify_session(email_sid.clone()),
    //         email_sid,
    //     )
    //     .await?;

    // returns email_token
}
    