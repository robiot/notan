use crate::{
    error::{Error, Result},
    jwt,
    routes::Response,
    state::AppState,
    utils::database::user::{create_user, CreateUser},
};

use {
    axum::extract::ConnectInfo,
    axum::extract::State,
    axum::Json,
    hyper::{HeaderMap, StatusCode},
    log::error,
    oauth2::RedirectUrl,
    oauth2::{
        basic::BasicClient, reqwest::async_http_client, AuthUrl, AuthorizationCode, ClientId,
        ClientSecret, TokenResponse, TokenUrl,
    },
    reqwest::{Client, Url},
    serde::{Deserialize, Serialize},
    std::net::SocketAddr,
    std::sync::Arc,
};

#[derive(Deserialize)]
pub struct GoogleAPIOAuthTokenResponse {
    pub access_token: String,
    pub id_token: String,
}

#[derive(Deserialize)]
pub struct GoogleAPIUserResult {
    pub id: String,
    pub email: String,
    pub name: String,
}

// This request
#[derive(Serialize, Deserialize)]
pub struct GoogleOAuthBody {
    pub google_auth_code: String,
}

#[derive(Serialize)]
pub struct GoogleOAuthResponse {
    pub token: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(body): Json<GoogleOAuthBody>,
) -> Result<Response<GoogleOAuthResponse>> {
    // Verify auth

    let google_client_id = ClientId::new(state.config.google_oauth_client_id.to_owned());
    let google_client_secret =
        ClientSecret::new(state.config.google_oauth_client_secret.to_owned());

    let auth_url = AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())?;
    let token_url = TokenUrl::new("https://www.googleapis.com/oauth2/v3/token".to_string())?;

    let client = BasicClient::new(
        google_client_id,
        Some(google_client_secret),
        auth_url,
        Some(token_url),
    )
    .set_redirect_uri(
        RedirectUrl::new("http://localhost:3000".to_string()).expect("Invalid redirect URL"),
    );

    let auth_code = AuthorizationCode::new(body.google_auth_code);

    let token_info = client
        .exchange_code(auth_code)
        .request_async(async_http_client)
        .await?;

    // Get mail

    let mut url = Url::parse("https://www.googleapis.com/oauth2/v1/userinfo").unwrap();
    url.query_pairs_mut().append_pair("alt", "json");
    url.query_pairs_mut()
        .append_pair("access_token", token_info.access_token().secret());

    let http_client = Client::new();

    let google_user_info_response = http_client.get(url).send().await?;

    // TODO: make this better
    if !google_user_info_response.status().is_success() {
        error!(
            "Get user info failed with status: {}",
            google_user_info_response.status().as_str()
        );
        return Err(Error::InternalServerError);
    }

    let google_user_info_data = google_user_info_response
        .json::<GoogleAPIUserResult>()
        .await?;

    // check if google connection with google_user_id exists
    let google_connection =
        sqlx::query_as::<
            sqlx::Postgres,
            crate::schemas::user_google_connection::UserGoogleConnection,
        >(r#"SELECT * FROM public.user_google_connections WHERE google_user_id = $1"#)
        .bind(google_user_info_data.id.clone())
        .fetch_optional(&state.db)
        .await?;

    let user_id = if let Some(google_connection) = google_connection {
        google_connection.user_id
    } else {
        // see if user with their email exists, if not create user and add google connection

        let user = sqlx::query_as::<sqlx::Postgres, crate::schemas::user::User>(
            r#"SELECT * FROM public.users WHERE email = $1"#,
        )
        .bind(google_user_info_data.email.clone())
        .fetch_optional(&state.db)
        .await?;

        let user_id = if let Some(user) = user {
            user.id
        } else {
            // create user

            let user = create_user(CreateUser {
                email: google_user_info_data.email.clone(),
                name: Some(google_user_info_data.name.clone()),
                password: None,
                username: None,
                verified_mail: Some(true),
                state: state.clone(),
                addr: addr.clone(),
                headers: headers.clone(),
            })
            .await?;

            // insert google connection

            sqlx::query(
                r#"INSERT INTO public.user_google_connections (user_id, google_user_id) VALUES ($1, $2)"#,
            )
            .bind(user.id.clone())
            .bind(google_user_info_data.id.clone())
            .execute(&state.db)
            .await?;

            user.id
        };

        user_id
    };

    let token = jwt::user::User::generate(&user_id, &state.config.jwt_secret)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(GoogleOAuthResponse { token }),
    ))
}
