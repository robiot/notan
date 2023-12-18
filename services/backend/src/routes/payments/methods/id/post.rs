use crate::{
    auth::check_auth, error::Result, routes::Response, state::AppState, utils::payments::customer,
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
    let customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    stripe::PaymentMethod::attach(
        &state.stripe,
        &stripe::PaymentMethodId::from_str(&params.payment_method_id)?,
        stripe::AttachPaymentMethod {
            customer: customer.id,
        },
    )
    .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
