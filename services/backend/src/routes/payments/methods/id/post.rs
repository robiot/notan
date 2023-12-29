use crate::{
    auth::check_auth, error::{Result, Error}, routes::{Response, ResponseError}, state::AppState, utils::payments::customer,
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

    match stripe::PaymentMethod::attach(
        &state.stripe,
        &stripe::PaymentMethodId::from_str(&params.payment_method_id)?,
        stripe::AttachPaymentMethod {
            customer: customer.id,
        },
    )
    .await {
        Ok(a) => Ok(a),
        Err(err) => {
            match err {
                stripe::StripeError::Stripe(request_error) => {
                    match request_error.error_type {
                        stripe::ErrorType::Card => {
                            return Err(Error::BadRequest(ResponseError {
                                message: request_error
                                    .message
                                    .unwrap_or("unknown_error".to_string()),
                                name: "card_error".to_string(),
                            }));
                        }
                        _ => {
                            // Handle other types of Stripe errors
                            log::error!("Stripe error on payment method attach: {:?}", request_error);

                            return Err(Error::BadRequest(ResponseError {
                                message: request_error
                                    .message
                                    .unwrap_or("unknown_error".to_string()),
                                name: "method_error".to_string(),
                            }));
                        }
                    }
                }
                _ => {
                    // Handle other types of errors
                    println!("Other methods error: {:?}", err);

                    Err(err)
                }
            }
        }
    }?;

    Ok(Response::new_success(StatusCode::OK, None))
}
