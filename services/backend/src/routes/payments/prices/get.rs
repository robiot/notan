use crate::{auth::check_auth, error::Result, routes::Response, schemas, state::AppState};

use {
    axum::extract::State,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct GetPricesResponse {
    pub price_id: String,
    pub product_id: String,
    pub lookup_key: String,
    pub price: i64,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<Vec<GetPricesResponse>>> {
    check_auth(headers.clone(), state.clone()).await?;

    let prices =
        sqlx::query_as::<sqlx::Postgres, schemas::stripe_product_price::StripeProductPrice>(
            r#"SELECT * FROM public.stripe_product_prices"#,
        )
        .fetch_all(&state.db)
        .await?;

    let mut output: Vec<GetPricesResponse> = Vec::new();

    for price in prices {
        // 1000 times faster than using the stripe api
        let stripe_price_data =
            sqlx::query_as::<sqlx::Postgres, schemas::stripe_price_currency::StripePriceCurrency>(
                r#"SELECT * FROM public.stripe_price_currencies WHERE stripe_price_id = $1 AND currency = 'eur';"#,
            )
            .bind(price.stripe_price_id.clone())
            .fetch_one(&state.db)
            .await?;

        output.push(GetPricesResponse {
            price_id: price.stripe_price_id,
            product_id: price.stripe_product_id,
            lookup_key: price.lookup_key,
            price: stripe_price_data.price,
        })
    }

    Ok(Response::new_success(StatusCode::OK, Some(output)))
}
