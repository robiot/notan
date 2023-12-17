use crate::{
    auth::check_auth,
    error::{Error, Result},
    routes::Response,
    state::AppState,
};

use {
    axum::extract::State,
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::str::FromStr,
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct GetPricesBody {
    // if card_token is not provided, you have to use elements
    pub card_token: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct GetPricesResponse {
    pub price_id: String,
    pub product_id: String,
    pub lookup_id: String,
    pub price: i64,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(_body): Json<GetPricesBody>,
) -> Result<Response<Vec<GetPricesResponse>>> {
    check_auth(headers.clone(), state.clone()).await?;

    let prices = sqlx::query_as::<
        sqlx::Postgres,
        crate::schemas::stripe_product_price::StripeProductPrice,
    >(r#"SELECT * FROM public.stripe_product_prices"#)
    .fetch_all(&state.db)
    .await?;

    let mut output: Vec<GetPricesResponse> = Vec::new();

    for price in prices {
        // get price data from stripe
        let stripe_price_data = stripe::Price::retrieve(
            &state.stripe,
            &stripe::PriceId::from_str(&price.stripe_price_id)?,
            &[],
        )
        .await?;

        let unit_amount = stripe_price_data
            .unit_amount
            .ok_or(Error::StripeFieldNotFoundError(
                "Price unit_amount".to_string(),
            ))?;
        let lookup_key = stripe_price_data
            .lookup_key
            .ok_or(Error::StripeFieldNotFoundError(
                "Price lookup_key".to_string(),
            ))?;

        output.push(GetPricesResponse {
            price_id: price.stripe_price_id,
            product_id: price.stripe_product_id,
            lookup_id: lookup_key,
            price: unit_amount,
        })
    }

    Ok(Response::new_success(StatusCode::OK, Some(output)))
}
