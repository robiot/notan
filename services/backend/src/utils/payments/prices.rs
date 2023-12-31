use std::sync::Arc;

use crate::{
    error::{Error, Result},
    routes::ResponseError,
    state::AppState,
    utils::products::utils::get_product_by_price_key,
};

/**
 * Gets price value for a stripe price
 */
pub fn get_price_value_from_price(price: stripe::Price) -> Result<i64> {
    if let Some(unit_amount) = price.unit_amount {
        return Ok(unit_amount);
    } else {
        return Err(Error::InternalServerError);
    }
}

pub async fn ensure_product_limit_by_price(
    user_id: String,
    price_id: String,
    state: Arc<AppState>,
) -> Result<()> {
    let product = get_product_by_price_key(state.products.clone(), &price_id)?;

    let owns_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM public.owned_products WHERE user_id = $1 AND product_id = $2;
        "#,
    )
    .bind(user_id.clone())
    .bind(product.id.clone())
    .fetch_one(&state.db)
    .await?;

    if owns_count >= product.max_own.unwrap_or(0) as i64 {
        return Err(Error::BadRequest(ResponseError {
            message: "Reached limit".to_string(),
            name: "reached_limit".to_string(),
        }));
    }

    Ok(())
}
