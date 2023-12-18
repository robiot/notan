use std::sync::Arc;

use crate::{error::{Error, Result}, state::AppState, routes::ResponseError};

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
    let product_price = sqlx::query_as::<sqlx::Postgres, crate::schemas::stripe_product_price::StripeProductPrice>(
        r#"SELECT * FROM public.stripe_product_prices WHERE stripe_price_id = $1"#,
    )
    .bind(price_id.clone())
    .fetch_one(&state.db)
    .await?;

    let product = sqlx::query_as::<sqlx::Postgres, crate::schemas::stripe_product::StripeProduct>(
        r#"SELECT * FROM public.stripe_products WHERE stripe_product_id = $1"#,
    )
    .bind(product_price.stripe_product_id.clone())
    .fetch_one(&state.db)
    .await?;

    let owns_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM public.product_purchases WHERE user_id = $1 AND stripe_product_id = $2;
        "#,
    )
    .bind(user_id.clone())
    .bind(product.stripe_product_id.clone())
    .fetch_one(&state.db)
    .await?;

    if owns_count >= product.max_own.unwrap_or(0) as i64 {
        return Err(Error::BadRequest(
            ResponseError {
                message: "Reached limit".to_string(),
                name: "reached_limit".to_string(),
            },
        ));
    }

    Ok(())
}
