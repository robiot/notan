use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{Response, ResponseError},
    state::AppState,
};

use super::PaymentMethodIdParams;

use {
    axum::extract::{Path, State},
    hyper::HeaderMap,
    hyper::StatusCode,
    std::str::FromStr,
    std::sync::Arc,
};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<PaymentMethodIdParams>,
    headers: HeaderMap,
) -> Result<Response<Vec<String>>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let active_subscription = sqlx::query_as::<
        sqlx::Postgres,
        crate::schemas::active_subscriptions::ActiveSubscription,
    >("SELECT * FROM public.active_subscriptions WHERE user_id = $1")
    .bind(id.clone())
    .fetch_optional(&state.db)
    .await?;

    if let Some(active_subscription) = active_subscription {
        // check if params.payment_method_id is the same as active_subscription.payment_method_id
        let subscription = stripe::Subscription::retrieve(
            &state.stripe,
            &stripe::SubscriptionId::from_str(&active_subscription.stripe_subscription_id)?,
            &[],
        )
        .await?;

        let payment_method_id = subscription
            .default_payment_method
            .and_then(|product| match product {
                stripe::Expandable::Id(payment_method) => Some(payment_method),
                _ => None,
            })
            .ok_or(Error::StripeFieldNotFoundError(
                "Payment method id expandable".to_string(),
            ))?;

        if payment_method_id == params.payment_method_id.clone() {
            return Err(Error::BadRequest(ResponseError {
                message: "Can't remove default payment method".to_string(),
                name: "default_payment_method".to_string(),
            }));
        }
    }

    // todo: (security) ensure that the logged in user is the owner of the payment method
    stripe::PaymentMethod::detach(
        &state.stripe,
        &stripe::PaymentMethodId::from_str(&params.payment_method_id)?,
    )
    .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
