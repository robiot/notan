use std::{
    collections::hash_map::DefaultHasher,
    hash::{Hash, Hasher},
    str::FromStr,
    sync::Arc,
};

use crate::{error::Result, schemas, state::AppState, utils::products::BillingPeriod};

// maybe split this up into multiple functions in the future
// hey have fun reading this really long function
pub async fn ensure_stripe_products(state: Arc<AppState>) -> Result<()> {
    // generate a checksum for state.products
    let mut hasher = DefaultHasher::new();
    state.products.hash(&mut hasher);
    let products_checksum = hasher.finish().to_string();

    // check if the checksum is the same as the one in the db
    let last_sync = sqlx::query_as::<sqlx::Postgres, schemas::products_sync::ProductsSync>(
        r#"SELECT * FROM public._products_sync WHERE hash = $1"#,
    )
    .bind(products_checksum.clone())
    .fetch_optional(&state.db)
    .await?;

    if let Some(last_sync) = last_sync {
        if last_sync.hash == products_checksum.to_string() {
            log::info!("Products are up to date, skipping sync");
            return Ok(());
        }
    }

    log::info!("Syncing stripe products...");

    // loop over state.products and check if they exist on stripe, if not, create them
    let stripe_products = stripe::Product::list(
        &state.stripe,
        &stripe::ListProducts {
            active: Some(true),
            ..Default::default()
        },
    )
    .await?;

    for product in state.products.clone() {
        let stripe_product = stripe_products
            .data
            .iter()
            .find(|&p| p.id.to_string() == product.id);

        if let Some(stripe_product) = stripe_product {
            stripe::Product::update(
                &state.stripe,
                &stripe_product.id,
                stripe::UpdateProduct {
                    name: Some(&product.title),
                    description: Some(product.description.clone()),

                    ..Default::default()
                },
            )
            .await?;
        } else {
            stripe::Product::create(
                &state.stripe,
                stripe::CreateProduct {
                    id: Some(&product.id),
                    name: &product.title,
                    statement_descriptor: None,
                    description: Some(&product.description.clone()),
                    active: Some(true),
                    expand: &[],
                    metadata: None,
                    features: None,
                    images: None,
                    package_dimensions: None,
                    shippable: None,
                    tax_code: Some(stripe::TaxCodeId::from_str("txcd_10103000")?),
                    type_: None,
                    unit_label: None,
                    url: None,
                    default_price_data: None,
                    // this didn't work for some damn reason -.-
                    // ..Default::default()
                },
            )
            .await?;
        }

        // loop over the prices and check if they exist on stripe, if not, create them
        let stripe_prices = stripe::Price::list(
            &state.stripe,
            &stripe::ListPrices {
                active: Some(true),
                product: Some(stripe::IdOrCreate::Id(&product.id)),
                ..Default::default()
            },
        )
        .await?;

        for price in product.prices {
            let stripe_price = stripe_prices
                .data
                .iter()
                .find(|&p| p.lookup_key == Some(price.key.clone()));

            // for if we want to support multiple currencies
            // let mut currency_options: HashMap<
            //     stripe::Currency,
            //     stripe::CreatePriceCurrencyOptions,
            //     RandomState,
            // > = HashMap::new();

            // for price_currency in price.price_currencies {
            //     currency_options.insert(
            //         price_currency.currency,
            //         stripe::CreatePriceCurrencyOptions {
            //             unit_amount: Some(price_currency.price),

            //             ..Default::default()
            //         },
            //     );
            // }

            // because we need optional
            let db_price = sqlx::query_as::<sqlx::Postgres, schemas::price::Price>(
                r#"SELECT * FROM public.prices WHERE price_key = $1"#,
            )
            .bind(price.key.clone())
            .fetch_optional(&state.db)
            .await?;

            let first_currency = price.price_currencies.first();

            let stripe_price_id: Option<String>;

            if let Some(first_currency) = first_currency {
                if let Some(stripe_price) = stripe_price {
                    stripe::Price::update(
                        &state.stripe,
                        &stripe_price.id,
                        stripe::UpdatePrice {
                            active: Some(true),
                            lookup_key: Some(&price.key.clone()),

                            ..Default::default()
                        },
                    )
                    .await?;

                    stripe_price_id = Some(stripe_price.id.to_string());
                } else {
                    let billing_interval = match price.billing_period {
                        BillingPeriod::Monthly => Some(stripe::CreatePriceRecurringInterval::Month),
                        BillingPeriod::Yearly => Some(stripe::CreatePriceRecurringInterval::Year),
                        _ => None,
                    };

                    let recurring = if let Some(billing_interval) = billing_interval {
                        Some(stripe::CreatePriceRecurring {
                            interval: billing_interval,
                            aggregate_usage: None,
                            interval_count: Some(1),
                            ..Default::default()
                        })
                    } else {
                        None
                    };

                    let stripe_new_price = stripe::Price::create(
                        &state.stripe,
                        stripe::CreatePrice {
                            active: Some(true),
                            lookup_key: Some(&price.key.clone()),
                            product: Some(stripe::IdOrCreate::Id(&product.id.clone())),
                            currency: first_currency.currency,
                            unit_amount: Some(first_currency.price),
                            recurring,
                            billing_scheme: None,
                            currency_options: None,
                            custom_unit_amount: None,
                            metadata: None,
                            nickname: None,
                            product_data: None,
                            tax_behavior: Some(stripe::PriceTaxBehavior::Inclusive),
                            tiers: None,
                            tiers_mode: None,
                            transfer_lookup_key: None,
                            transform_quantity: None,
                            unit_amount_decimal: None,
                            expand: &[],
                            // weird, doenst exist here either
                            // ..Default::default()
                        },
                    )
                    .await?;

                    stripe_price_id = Some(stripe_new_price.id.to_string());
                }

                // Might have been inserted from another instance, so we always check if it exists and update it
                if db_price.is_none() {
                    sqlx::query(
                        r#"
                    INSERT INTO public.prices (price_key, stripe_price_id)
                    VALUES ($1, $2)
                    "#,
                    )
                    .bind(price.key.clone())
                    .bind(stripe_price_id)
                    .execute(&state.db)
                    .await?;
                }
            }
        }
    }

    // Insert the new checksum into the db

    sqlx::query(
        r#"
        INSERT INTO public._products_sync (hash)
        VALUES ($1)
        ON CONFLICT (id) DO UPDATE SET hash = $1;
        "#,
    )
    .bind(products_checksum)
    .execute(&state.db)
    .await?;

    Ok(())
}
