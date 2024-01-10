use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{Response, ResponseError},
    schemas,
    state::AppState,
    utils::{database::prices::get_price_by_price_key, payments::customer},
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

use super::{BuyIdParams, PaymentMethodRequiredBody};

#[derive(Serialize, Deserialize)]
pub struct SubscribeResponse {
    pub client_secret: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<BuyIdParams>,
    headers: HeaderMap,
    Json(body): Json<PaymentMethodRequiredBody>,
) -> Result<Response<SubscribeResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    // it cancels previous subscription on webhook event
    let active_subscriptions = sqlx::query_as::<
        sqlx::Postgres,
        schemas::active_subscriptions::ActiveSubscription,
    >("SELECT * FROM public.active_subscriptions WHERE user_id = $1")
    .bind(id.clone())
    .fetch_all(&state.db)
    .await?;

    // check if user has active subscription, then send error
    if active_subscriptions.len() > 0 {
        return Err(Error::BadRequest(ResponseError {
            name: "already_subscriber".to_string(),
            message: "You already have active subscription".to_string(),
        }));
    }

    let db_price = get_price_by_price_key(params.price_key.clone(), &state.db).await?;

    // Subscription
    let mut subscription_data = stripe::CreateSubscription::new(customer.id);
    subscription_data.currency = Some(stripe::Currency::USD);
    // #2
    subscription_data.payment_behavior =
        Some(stripe::SubscriptionPaymentBehavior::DefaultIncomplete);
    subscription_data.items = Some(vec![stripe::CreateSubscriptionItems {
        price: Some(db_price.stripe_price_id.clone()),

        ..Default::default()
    }]);
    subscription_data.automatic_tax =
        Some(stripe::CreateSubscriptionAutomaticTax { enabled: true });
    subscription_data.expand = &["latest_invoice.payment_intent"];
    // #2
    // subscription_data.collection_method = Some(stripe::CollectionMethod::ChargeAutomatically);

    let payment_method_id_str = body.payment_method_id.clone();
    subscription_data.default_payment_method = Some(&payment_method_id_str);

    let subscription = stripe::Subscription::create(&state.stripe, subscription_data).await?;

    let first_pi = subscription
        .latest_invoice
        .clone()
        .and_then(|invoice| match invoice {
            stripe::Expandable::Object(invoice) => invoice.payment_intent,
            _ => None,
        })
        .and_then(|payment_intent| match payment_intent {
            stripe::Expandable::Object(payment_intent) => Some(payment_intent),
            _ => None,
        })
        .ok_or(Error::StripeFieldNotFoundError(
            "Price Subscription invoice.payment_intent".to_string(),
        ))?;
    // Inserted into database by webhook

    let client_secret = first_pi
        .clone()
        .client_secret
        .ok_or(Error::StripeFieldNotFoundError(
            "Price Subscription first_pi client_secret".to_string(),
        ))?;

    stripe::PaymentIntent::update(
        &state.stripe,
        &first_pi.id,
        stripe::UpdatePaymentIntent {
            setup_future_usage: Some(stripe::PaymentIntentSetupFutureUsageFilter::OffSession),
            ..Default::default()
        },
    )
    .await?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(SubscribeResponse { client_secret }),
    ))
}
