use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{payments::IntentResponse, Response},
    state::AppState,
    utils::payments::{customer, products},
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
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
    Json(body): Json<SubscriptionSubscribeBody>,
) -> Result<Response<IntentResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;
    let price =
        products::get_product_price_object(params.product_id.clone(), state.clone()).await?;

    // Subscription
    let mut subscription_data = stripe::CreateSubscription::new(customer.id);
    subscription_data.currency = Some(stripe::Currency::EUR);
    subscription_data.payment_behavior =
        Some(stripe::SubscriptionPaymentBehavior::DefaultIncomplete);
    subscription_data.expand = &[
        "items",
        "items.data.price.product",
        "schedule",
        "latest_invoice.payment_intent",
    ];
    subscription_data.items = Some(vec![stripe::CreateSubscriptionItems {
        price: Some(price.id.to_string()),
        ..Default::default()
    }]);

    // disable unused assignment warning
    #[allow(unused_assignments)]
    let mut card_token_str = String::new();
    if let Some(card_token) = body.card_token {
        // so it does not get dropped
        card_token_str = card_token.clone();

        subscription_data.default_payment_method = Some(&card_token_str);
    }

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
