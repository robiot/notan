use std::net::SocketAddr;

use crate::{
    error::Result,
    jwt,
    routes::Response,
    state::AppState,
    utils::{
        self,
        database::user::{create_user, CreateUser},
        validation,
    },
};

use {
    axum::{
        extract::{ConnectInfo, State},
        Json,
    },
    hyper::{HeaderMap, StatusCode},
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

    let user = create_user(CreateUser {
        email: email.clone(),
        username: Some(username.clone()),
        password: Some(body.password.clone()),
        name: None,
        verified_mail: Some(false),
        state: state.clone(),
        addr: addr.clone(),
        headers: headers.clone(),
    })
    .await?;

    let token = jwt::user::User::generate(&user.id, &state.config.jwt_secret)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(SignupResponse { token }),
    ))
}
