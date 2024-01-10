use crate::{
    auth::check_auth,
    error::Result,
    routes::Response,
    state::AppState,
    utils::{self, validation},
};

use {
    axum::{extract::State, Json},
    hyper::{HeaderMap, StatusCode},
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct UserUsernameBody {
    pub email: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<UserUsernameBody>,
) -> Result<Response<bool>> {
    let email = body.email.clone().to_lowercase();

    validation::validate_email(email.clone())?;

    let id = check_auth(headers.clone(), state.clone()).await?;

    utils::database::user::check_email_taken(email.clone(), &state.db).await?;

    // set email, and set verified_mail to false
    sqlx::query(
        r#"
        UPDATE public.users
        SET email = $1, verified_mail = false
        WHERE id = $2
        "#,
    )
    .bind(email.clone())
    .bind(id.clone())
    .execute(&state.db)
    .await?;

    // update stripe customer

    let customer = utils::payments::customer::get_stripe_customer_if_exists_by_user_id(
        id.clone(),
        state.clone(),
    )
    .await?;

    if let Some(customer) = customer {
        stripe::Customer::update(
            &state.stripe,
            &customer.id,
            stripe::UpdateCustomer {
                email: Some(&email.clone()),
                ..Default::default()
            },
        )
        .await?;
    }

    Ok(Response::new_success(StatusCode::OK, None))
}
