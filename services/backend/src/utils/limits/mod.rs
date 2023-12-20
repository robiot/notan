use std::sync::Arc;

use crate::{error::Result, schemas, state::AppState};

const FREE_MAX_STORAGE: i32 = 25;
const FREE_MAX_NOTE_LENGTH: i32 = 300;

#[derive(Debug, Clone)]
pub struct Limits {
    pub max_note_storage: i32,
    pub max_note_length: i32,
    pub has_unlimited_notes_per_domain: bool,
}

// 太酷了！ 再见！
pub async fn get_limits(user_id: String, state: Arc<AppState>) -> Result<Limits> {
    let mut max_note_storage: i32;
    let mut max_note_length: i32;
    let mut has_unlimited_notes_per_domain: bool = false;

    // first we set from active subscription
    let subscription = sqlx::query_as::<
        sqlx::Postgres,
        schemas::active_subscriptions::ActiveSubscription,
    >(r#"SELECT * FROM public.active_subscriptions WHERE user_id = $1"#)
    .bind(user_id.clone())
    .fetch_optional(&state.db)
    .await?;

    if let Some(subscription) = subscription {
        let product = sqlx::query_as::<sqlx::Postgres, schemas::stripe_product::StripeProduct>(
            r#"SELECT * FROM public.stripe_products WHERE stripe_product_id = $1"#,
        )
        .bind(subscription.stripe_product_id.clone())
        .fetch_one(&state.db)
        .await?;

        // for subscriptions we use the increase fields as defaults instead of free defaults
        max_note_storage = product.storage_increase.unwrap_or(0);
        max_note_length = product.length_increase.unwrap_or(0);
        has_unlimited_notes_per_domain = product.unlimited_per_domain;
    } else {
        max_note_storage = FREE_MAX_STORAGE;

        max_note_length = FREE_MAX_NOTE_LENGTH;
    }

    // then we get values from all product purchases
    let purchases = sqlx::query_as::<sqlx::Postgres, schemas::product_purchases::ProductPurchase>(
        r#"SELECT * FROM public.product_purchases WHERE user_id = $1"#,
    )
    .bind(user_id.clone())
    .fetch_all(&state.db)
    .await?;

    for purchase in purchases {
        let product = sqlx::query_as::<sqlx::Postgres, schemas::stripe_product::StripeProduct>(
            r#"SELECT * FROM public.stripe_products WHERE stripe_product_id = $1"#,
        )
        .bind(purchase.stripe_product_id.clone())
        .fetch_one(&state.db)
        .await?;

        max_note_storage += product.storage_increase.unwrap_or(0);
        max_note_length += product.length_increase.unwrap_or(0);
    }

    Ok(Limits {
        max_note_storage,
        max_note_length,
        has_unlimited_notes_per_domain,
    })
}
