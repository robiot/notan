use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::{Response, ResponseError},
    state::AppState,
    utils::{
        payments::{customer, prices::ensure_product_limit_by_price},
        products::utils::{get_price_by_price_key, get_price_currency_from_price, get_product_by_price_key},
    },
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    std::str::FromStr,
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
    ensure_product_limit_by_price(id.clone(), params.price_key.clone(), state.clone()).await?;

    let user = sqlx::query_as::<sqlx::Postgres, crate::schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(id.clone())
    .fetch_one(&state.db)
    .await?;

    let product = get_product_by_price_key(state.products.clone(), &params.price_key.clone())?;

    let product_price = get_price_by_price_key(state.products.clone(), &params.price_key.clone())?;

    let price_currency = get_price_currency_from_price(product_price, stripe::Currency::EUR)?;

    // create payment intent, we only use EUR for now
    let mut payment_intent_data =
        stripe::CreatePaymentIntent::new(price_currency.price, stripe::Currency::EUR);

    payment_intent_data.payment_method_types = Some(vec!["card".to_string()]);
    payment_intent_data.customer = Some(customer.id);
    payment_intent_data.receipt_email = Some(&user.email);
    payment_intent_data.confirm = Some(true);
    payment_intent_data.payment_method = Some(stripe::PaymentMethodId::from_str(
        body.payment_method_id.as_str(),
    )?);

    // todo handle payment intent on client instead for 3d secure support
    // responding with error (StripeError(Stripe(RequestError { http_status: 402, error_type: Card, message: Some("Your card was declined."), code: Some(CardDeclined), decline_code: Some("generic_decline"), charge
    match stripe::PaymentIntent::create(&state.stripe, payment_intent_data).await {
        Ok(_) => {}
        // handle following error responding with error (StripeError(Stripe(RequestError { http_status: 402, error_type: Card, message: Some("Your card was declined."), code: Some(CardDeclined), decline_code: Some("generic_decline"), charge: Some("ch_3ORGunLdGhPNcQTv0Jec2xgz") })))
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
                            log::error!("Stripe error on transaction: {:?}", request_error);

                            return Err(Error::BadRequest(ResponseError {
                                message: request_error
                                    .message
                                    .unwrap_or("unknown_error".to_string()),
                                name: "payment_error".to_string(),
                            }));
                        }
                    }
                }
                _ => {
                    // Handle other types of errors
                    println!("Other error: {:?}", err);
                }
            }
        }
    }

    // Safe to assume that the payment intent was created successfully and charged here

    // insert into product_purchases
    sqlx::query(
        r#"
        INSERT INTO public.owned_products (user_id, product_id)
        VALUES ($1, $2)
        "#,
    )
    .bind(id.clone())
    .bind(product.id.clone())
    .execute(&state.db)
    .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
