use crate::{
    auth::check_auth, error::Result, routes::Response, state::AppState, utils::payments::customer,
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    std::sync::Arc,
};

use super::{BuyIdParams, PaymentMethodRequiredBody};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<BuyIdParams>,
    headers: HeaderMap,
    Json(body): Json<PaymentMethodRequiredBody>,
) -> Result<Response<String>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    // todo: cancel previous subscription

    // Subscription
    let mut subscription_data = stripe::CreateSubscription::new(customer.id);
    subscription_data.currency = Some(stripe::Currency::EUR);
    subscription_data.items = Some(vec![stripe::CreateSubscriptionItems {
        price: Some(params.price_id.clone()),

        ..Default::default()
    }]);
    subscription_data.automatic_tax =
        Some(stripe::CreateSubscriptionAutomaticTax { enabled: true });
    subscription_data.expand = &["latest_invoice.payment_intent"];
    subscription_data.collection_method = Some(stripe::CollectionMethod::ChargeAutomatically);

    let payment_method_id_str = body.payment_method_id.clone();
    subscription_data.default_payment_method = Some(&payment_method_id_str);

    stripe::Subscription::create(&state.stripe, subscription_data).await?;

    // Inserted into database by webhook

    Ok(Response::new_success(StatusCode::OK, None))
}
