use std::{collections::HashMap, sync::Arc};

use crate::{
    error::{Error, Result},
    state::AppState,
};

// this really needs rework in the future to check if the products are up to date and if not, update them
pub async fn ensure_stripe_products(state: Arc<AppState>) -> Result<()> {
    // todo: check if products are up to date
    let prices_db = sqlx::query_as::<
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

    // if prices_db.len() == 0 || products.len() == 0 {
    // load all products and prices from stripe
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

        // check if price with price.id.to_string() exists in stripe_product_prices
        if prices_db
            .iter()
            .any(|price_db| price_db.stripe_price_id == price.id.to_string())
        {
            continue;
        }

        // Insert price
        sqlx::query(
                r#"
                    INSERT INTO public.stripe_product_prices (stripe_price_id, stripe_product_id, lookup_key)
                    VALUES ($1, $2, $3)
                    "#,
            )
            .bind(price.id.to_string())
            .bind(stripe_product.id.to_string())
            .bind(price.lookup_key.clone())
            .execute(&state.db)
            .await?;

        let currency_options = if let Some(currency_options) = price.currency_options.clone() {
            currency_options
        } else {
            let currency = price.currency.ok_or(Error::StripeFieldNotFoundError(
                "Price currency".to_string(),
            ))?;

            let mut new_hashmap: HashMap<stripe::Currency, stripe::CurrencyOption> = HashMap::new();

            new_hashmap.insert(
                currency,
                stripe::CurrencyOption {
                    unit_amount: price.unit_amount,
                    ..Default::default()
                },
            );

            new_hashmap
        };

        // iterate over currency options and insert them into db
        for (currency, currency_option) in currency_options.iter() {
            let unit_amount =
                currency_option
                    .unit_amount
                    .ok_or(Error::StripeFieldNotFoundError(
                        "currency_option.unit_amount".to_string(),
                    ))?;

            // check if price currency for price.id.to_string() exists in stripe_price_currencies databaser
            let currency_db = sqlx::query(
                    r#"
                    SELECT * FROM public.stripe_price_currencies WHERE stripe_price_id = $1 AND currency = $2
                    "#,
                )
                .bind(price.id.to_string())
                .bind(currency.to_string())
                .fetch_optional(&state.db)
                .await?;

            if currency_db.is_some() {
                continue;
            }

            sqlx::query(
                r#"
                    INSERT INTO public.stripe_price_currencies (stripe_price_id, currency, price)
                    VALUES ($1, $2, $3)
                    "#,
            )
            .bind(price.id.to_string())
            .bind(currency.to_string())
            .bind(unit_amount)
            .execute(&state.db)
            .await?;
        }

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

        // check if product with stripe_product.id exists in stripe_products database
        if products
            .iter()
            .any(|product| product.stripe_product_id == stripe_product.id.to_string())
        {
            continue;
        }

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
    // }

    Ok(())
}
