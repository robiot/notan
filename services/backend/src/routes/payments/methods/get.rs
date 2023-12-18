use crate::{
    auth::check_auth, error::Result, routes::Response, state::AppState, utils::payments::customer,
};

use {
    axum::extract::State,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct CardInfo {
    pub last_four: String,
    pub exp: String,
    pub brand: String,
}

#[derive(Serialize, Deserialize)]
pub struct GetPaymentMethodsResponse {
    pub id: String,
    pub kind: String,
    pub card: Option<CardInfo>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<Vec<GetPaymentMethodsResponse>>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    let mut result: Vec<GetPaymentMethodsResponse> = Vec::new();

    let payment_methods = stripe::PaymentMethod::list(
        &state.stripe,
        &stripe::ListPaymentMethods {
            customer: Some(customer.id),
            // limit: Some(10),
            ..Default::default()
        },
    )
    .await?;

    for method in payment_methods.data.iter() {
        // get card, else continue

        let card = match method.card.clone() {
            Some(card) => card,
            None => continue,
        };

        result.push(GetPaymentMethodsResponse {
            id: method.id.to_string(),
            kind: method.type_.as_str().to_string(),
            card: Some(CardInfo {
                last_four: card.last4.to_string(),
                exp: format!("{}/{}", card.exp_month, card.exp_year),
                brand: card.brand.to_string(),
            }),
        })
    }

    Ok(Response::new_success(StatusCode::OK, Some(result)))
}
