use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{payments::IntentResponse, Response},
    state::AppState,
    utils::payments::customer,
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

use super::BuyIdParams;

#[derive(Serialize, Deserialize)]
pub struct SubscriptionSubscribeBody {
    // card has to be created before
    pub card_token: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<BuyIdParams>,
    headers: HeaderMap,
    Json(body): Json<SubscriptionSubscribeBody>,
) -> Result<Response<IntentResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    let price = stripe::Price::retrieve(
        &state.stripe,
        &stripe::PriceId::from_str(&params.price_id.clone())?,
        &[],
    )
    .await?;

    // Subscription
    let mut subscription_data = stripe::CreateSubscription::new(customer.id);
    subscription_data.currency = Some(stripe::Currency::EUR);
    subscription_data.payment_behavior =
        Some(stripe::SubscriptionPaymentBehavior::DefaultIncomplete);
    subscription_data.expand = &["latest_invoice.payment_intent"];

    subscription_data.items = Some(vec![stripe::CreateSubscriptionItems {
        price: Some(price.id.to_string()),
        ..Default::default()
    }]);

    let card_token_str = body.card_token.clone();
    subscription_data.default_payment_method = Some(&card_token_str);

    let subscription = stripe::Subscription::create(&state.stripe, subscription_data).await?;

    let client_secret = subscription
        .latest_invoice
        .clone()
        .and_then(|invoice| match invoice {
            stripe::Expandable::Object(invoice) => invoice.payment_intent,
            _ => None,
        })
        .and_then(|payment_intent| match payment_intent {
            stripe::Expandable::Object(payment_intent) => payment_intent.client_secret,
            _ => None,
        })
        .ok_or(Error::InternalServerError)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(IntentResponse { client_secret }),
    ))
}
