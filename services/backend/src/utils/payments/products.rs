use crate::{
    error::{Error, Result},
    state::AppState,
};

use std::sync::Arc;

/**
 * Gets price object for a stripe product by id
 */
pub async fn get_product_price_object(id: String, state: Arc<AppState>) -> Result<stripe::Price> {
    let prices = stripe::Price::list(
        &state.stripe,
        &stripe::ListPrices {
            product: Some(stripe::IdOrCreate::Id(&id)),
            currency: Some(stripe::Currency::EUR),
            ..Default::default()
        },
    )
    .await?;

    // get first price
    let price = prices.data.first();

    // Check if price exists, at least one price shall be created for each product
    return if let Some(price) = price {
        Ok(price.clone())
    }
    // Somebody forgot to add price to product, or product does not exist
    else {
        Err(Error::InternalServerError)
    };
}

/**
 * Gets price for a stripe product by id
 */
pub async fn get_product_price(id: String, state: Arc<AppState>) -> Result<i64> {
    let price = get_product_price_object(id, state.clone()).await?;

    if let Some(unit_amount) = price.unit_amount {
        return Ok(unit_amount);
    } else {
        return Err(Error::InternalServerError);
    }
}
