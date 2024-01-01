use std::collections::HashMap;

use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::Response,
    state::AppState,
    utils::{
        payments::{customer, prices::ensure_product_limit_by_price},
        products::utils::{
            get_price_by_price_key, get_price_currency_from_price, get_product_by_price_key,
        },
    },
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

use super::{BuyIdParams, PaymentMethodRequiredBody};

#[derive(Serialize, Deserialize)]
pub struct IntentResponse {
    pub client_secret: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<BuyIdParams>,
    headers: HeaderMap,
    Json(body): Json<PaymentMethodRequiredBody>,
) -> Result<Response<IntentResponse>> {
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
    payment_intent_data.metadata = Some(HashMap::from([(
        "product_id".to_string(),
        product.id.to_string(),
    )]));
    payment_intent_data.receipt_email = Some(&user.email);
    payment_intent_data.payment_method = Some(stripe::PaymentMethodId::from_str(
        body.payment_method_id.as_str(),
    )?);

    // todo handle payment intent on client instead for 3d secure support
    // responding with error (StripeError(Stripe(RequestError { http_status: 402, error_type: Card, message: Some("Your card was declined."), code: Some(CardDeclined), decline_code: Some("generic_decline"), charge
    let payment_intent = stripe::PaymentIntent::create(&state.stripe, payment_intent_data).await?;

    let client_secret =
        payment_intent
            .clone()
            .client_secret
            .ok_or(Error::StripeFieldNotFoundError(
                "Intent client_secret".to_string(),
            ))?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(IntentResponse {
            client_secret: client_secret,
        }),
    ))
}
