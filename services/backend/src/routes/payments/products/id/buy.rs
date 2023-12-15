use crate::{
    auth::check_auth,
    error::Result,
    routes::{payments::CardActionBody, Response},
    state::AppState,
    utils::payments::customer,
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    std::sync::Arc,
};

use super::ProductsIdParams;

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(_params): Path<ProductsIdParams>,
    headers: HeaderMap,
    Json(_body): Json<CardActionBody>,
) -> Result<Response<String>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let customer = customer::get_stripe_customer(headers.clone(), state.clone()).await?;

    let user = sqlx::query_as::<sqlx::Postgres, crate::schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(id)
    .fetch_one(&state.db)
    .await?;

    // create payment intent
    let mut payment_intent = stripe::CreatePaymentIntent::new(100, stripe::Currency::EUR);

    payment_intent.payment_method_types = Some(vec!["card".to_string()]);
    payment_intent.customer = Some(customer.id);
    payment_intent.receipt_email = Some(&user.email);
    payment_intent.confirm = Some(true);

    stripe::PaymentIntent::create(&state.stripe, payment_intent).await?;

    // https://stripe.com/docs/api/payment_intents/create
    // receipt_email
    // currency_eur
    // confirm
    // customer: customerid

    Ok(Response::new_success(StatusCode::OK, None))
}
