use std::sync::Arc;

use crate::{error::Result, schemas, state::AppState};

use super::products::utils::get_product_by_id;

const FREE_MAX_STORAGE: i32 = 25;
const FREE_MAX_NOTE_LENGTH: i32 = 300;

#[derive(Debug, Clone)]
pub struct Limits {
    pub max_notes: i32,
    pub max_note_characters: i32,
    pub no_domain_restrictions: bool,
}

// 太酷了！ 再见！
pub async fn get_limits(user_id: String, state: Arc<AppState>) -> Result<Limits> {
    let mut max_note_storage: i32 = FREE_MAX_STORAGE;
    let mut max_note_length: i32 = FREE_MAX_NOTE_LENGTH;
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
        let product = get_product_by_id(state.products.clone(), &subscription.product_id)?;

        max_note_storage = product.perks.max_notes_base.unwrap_or(FREE_MAX_STORAGE);
        max_note_length = product
            .perks
            .max_note_characters_base
            .unwrap_or(FREE_MAX_STORAGE);
        has_unlimited_notes_per_domain = product.perks.no_domain_restrictions;
    }

    // then we get values from all product purchases
    let owned_products = sqlx::query_as::<sqlx::Postgres, schemas::owned_product::OwnedProduct>(
        r#"SELECT * FROM public.owned_products WHERE user_id = $1"#,
    )
    .bind(user_id.clone())
    .fetch_all(&state.db)
    .await?;

    for owned_product in owned_products {
        let product = get_product_by_id(state.products.clone(), &owned_product.product_id)?;

        max_note_storage += product.perks.max_notes_increase;
        max_note_length += product.perks.max_note_characters_increase;
    }

    Ok(Limits {
        max_notes: max_note_storage,
        max_note_characters: max_note_length,
        no_domain_restrictions: has_unlimited_notes_per_domain,
    })
}
