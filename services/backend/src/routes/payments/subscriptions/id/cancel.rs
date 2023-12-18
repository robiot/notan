use crate::{
    auth::check_auth,
    error::Result,
    routes::{payments::IntentResponse, Response},
    state::AppState,
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::str::FromStr,
    std::sync::Arc,
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
    let _id = check_auth(headers.clone(), state.clone()).await?;

    // todo: (security) check that params.id is owned by user

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
