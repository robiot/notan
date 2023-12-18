use crate::{
    auth::check_auth, error::Result, routes::Response, schemas, state::AppState,
    utils::payments::customer,
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

    let user = sqlx::query_as::<sqlx::Postgres, crate::schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(id)
    .fetch_one(&state.db)
    .await?;

    let stripe_price_data =
        sqlx::query_as::<sqlx::Postgres, schemas::stripe_price_currency::StripePriceCurrency>(
            r#"SELECT * FROM public.stripe_price_currencies WHERE stripe_price_id = $1 AND currency = 'eur';"#,
        )
        .bind(params.price_id.clone())
        .fetch_one(&state.db)
        .await?;

    // create payment intent, we only use EUR for now
    let mut payment_intent_data =
        stripe::CreatePaymentIntent::new(stripe_price_data.price, stripe::Currency::EUR);

    payment_intent_data.payment_method_types = Some(vec!["card".to_string()]);
    payment_intent_data.customer = Some(customer.id);
    payment_intent_data.receipt_email = Some(&user.email);
    payment_intent_data.confirm = Some(true);
    payment_intent_data.payment_method = Some(stripe::PaymentMethodId::from_str(
        body.payment_method_id.as_str(),
    )?);

    stripe::PaymentIntent::create(&state.stripe, payment_intent_data).await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
