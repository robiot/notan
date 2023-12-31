use crate::{
    auth::check_auth, error::Result, routes::Response, state::AppState,
    utils::products::utils::get_price_currency_from_price,
};

use {
    axum::extract::State,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct GetPricesResponse {
    pub price_key: String,
    pub product_id: String,
    pub price: i64,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<Vec<GetPricesResponse>>> {
    check_auth(headers.clone(), state.clone()).await?;

    let mut output: Vec<GetPricesResponse> = Vec::new();

    for product in state.products.clone() {
        for price in product.prices {
            let currency_price =
                get_price_currency_from_price(price.clone(), stripe::Currency::EUR)?;

            output.push(GetPricesResponse {
                price_key: price.key,
                product_id: product.id.clone(),
                price: currency_price.price,
            })
        }
    }

    Ok(Response::new_success(StatusCode::OK, Some(output)))
}
