use crate::{auth::check_auth, error::Result, routes::Response, state::AppState};

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
    check_auth(headers.clone(), state.clone()).await?;

    // todo: (security) ensure that the logged in user is the owner of the payment method
    stripe::PaymentMethod::detach(
        &state.stripe,
        &stripe::PaymentMethodId::from_str(&params.payment_method_id)?,
    )
    .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
