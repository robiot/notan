use crate::{
    auth::check_auth,
    error::Result,
    routes::{payments::IntentResponse, Response},
    state::AppState,
    utils::payments::{customer, prices::get_price_value_from_price},
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

use super::BuyIdParams;

#[derive(Serialize, Deserialize)]
pub struct ProductIntentBody {
    // if card_token is not provided, you have to use elements
    pub card_token: Option<String>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<BuyIdParams>,
    headers: HeaderMap,
    Json(body): Json<ProductIntentBody>,
) -> Result<Response<IntentResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    let user = sqlx::query_as::<sqlx::Postgres, crate::schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(id)
    .fetch_one(&state.db)
    .await?;

    let price = stripe::Price::retrieve(
        &state.stripe,
        &stripe::PriceId::from_str(&params.price_id.clone())?,
        &["product"],
    )
    .await?;

    // create payment intent, we only use EUR for now
    let mut payment_intent_data = stripe::CreatePaymentIntent::new(
        get_price_value_from_price(price.clone())?,
        stripe::Currency::EUR,
    );

    payment_intent_data.payment_method_types = Some(vec!["card".to_string()]);
    payment_intent_data.customer = Some(customer.id);
    payment_intent_data.receipt_email = Some(&user.email);

    // payment_intent.confirm = Some(true);

    // if card_token is provided, use it
    if let Some(card_token) = body.card_token {
        payment_intent_data.payment_method =
            Some(stripe::PaymentMethodId::from_str(card_token.as_str())?);
    }
    // else use elements and save the card
    else {
        payment_intent_data.setup_future_usage =
            Some(stripe::PaymentIntentSetupFutureUsage::OffSession);
    }

    let payment_intent = stripe::PaymentIntent::create(&state.stripe, payment_intent_data).await?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(IntentResponse {
            client_secret: payment_intent.client_secret.unwrap(),
        }),
    ))
}
