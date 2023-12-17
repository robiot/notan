use std::sync::Arc;

use crate::{
    error::{Error, Result},
    state::AppState,
};

pub async fn ensure_stripe_products(state: Arc<AppState>) -> Result<()> {
    // todo: check if products are up to date
    let prices = sqlx::query_as::<
        sqlx::Postgres,
        crate::schemas::stripe_product_price::StripeProductPrice,
    >(r#"SELECT * FROM public.stripe_product_prices"#)
    .fetch_all(&state.db)
    .await?;

    let products = sqlx::query_as::<sqlx::Postgres, crate::schemas::stripe_product::StripeProduct>(
        r#"SELECT * FROM public.stripe_products"#,
    )
    .fetch_all(&state.db)
    .await?;

    if prices.len() == 0 || products.len() == 0 {
        // load all products and prices from stripe

        let prices = stripe::Price::list(
            &state.stripe,
            &stripe::ListPrices {
                limit: Some(100),
                currency: Some(stripe::Currency::EUR),
                expand: &["data.product"],
                ..Default::default()
            },
        )
        .await?;

        let mut inserted_products: Vec<String> = Vec::new();

        for price in prices.data.iter() {
            let stripe_product = price
                .product
                .clone()
                .and_then(|product| match product {
                    stripe::Expandable::Object(product) => Some(product),
                    _ => None,
                })
                .ok_or(Error::StripeFieldNotFoundError(
                    "Price product expandable".to_string(),
                ))?;

            // Insert price
            sqlx::query(
                r#"
                    INSERT INTO public.stripe_product_prices (stripe_price_id, stripe_product_id)
                    VALUES ($1, $2)
                    "#,
            )
            .bind(price.id.to_string())
            .bind(stripe_product.id.to_string())
            .execute(&state.db)
            .await?;

            // Insert product
            if inserted_products.contains(&stripe_product.id.to_string()) {
                continue;
            }

            let name = stripe_product
                .name
                .ok_or(Error::StripeFieldNotFoundError("Product name".to_string()))?;

            let metadata = stripe_product
                .metadata
                .ok_or(Error::StripeFieldNotFoundError(
                    "Product metadata".to_string(),
                ))?;

            let max_own = metadata.get("max_own").and_then(|v| v.parse::<i32>().ok());

            let storage_increase = metadata
                .get("storage_increase")
                .and_then(|v| v.parse::<i32>().ok());

            let length_increase = metadata
                .get("length_increase")
                .and_then(|v| v.parse::<i32>().ok());

            let unlimited_per_domain =
                if let Some(unlimited_per_domain) = metadata.get("unlimited_per_domain") {
                    if unlimited_per_domain == "true" {
                        true
                    } else {
                        false
                    }
                } else {
                    false
                };

            sqlx::query(
                r#"
                INSERT INTO public.stripe_products (stripe_product_id, name, max_own, storage_increase, length_increase, unlimited_per_domain)
                VALUES ($1, $2, $3, $4, $5, $6)
                "#,
            )
            .bind(stripe_product.id.to_string())
            .bind(name)
            // null if not set
            .bind(max_own)
            .bind(storage_increase)
            .bind(length_increase)
            .bind(unlimited_per_domain)
            .execute(&state.db)
            .await?;

            inserted_products.push(stripe_product.id.to_string());
        }
    }

    Ok(())
}
