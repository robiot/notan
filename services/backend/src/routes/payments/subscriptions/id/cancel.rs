

use crate::{
    auth::check_auth,
    error::Result,
    routes::{payments::IntentResponse, Response},
    state::AppState,
    utils::payments::customer,
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
    std::str::FromStr,
    hyper::StatusCode
};

use super::SubscriptionsIdParams;

#[derive(Serialize, Deserialize)]
pub struct SubscriptionSubscribeBody {
    // if card_token is not provided, you have to use elements
    pub card_token: Option<String>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<SubscriptionsIdParams>,
    headers: HeaderMap,
    Json(_body): Json<SubscriptionSubscribeBody>,
) -> Result<Response<IntentResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let _customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    stripe::Subscription::cancel(
        &state.stripe,
        &stripe::SubscriptionId::from_str(&params.id)?,
        stripe::CancelSubscription {
            ..Default::default()
        },
    )
    .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
