use std::sync::Arc;

use crate::{error::Result, schemas, state::AppState};

use super::products::{self, utils::get_product_by_id};

const ABSOLUTE_MAX_NOTES: i32 = 10000;
const ABSOLUTE_MAX_TAGS: i32 = 5000;
const ABSOLUTE_MAX_CHARACTERS: i32 = 100000;

#[derive(Debug, Clone)]
pub struct Limits {
    pub max_tags: i32,
    pub max_per_domain: Option<i32>,

    pub max_notes: i32,
    pub max_note_characters: i32,
}

// 太酷了！ 再见！
pub async fn get_limits(user_id: String, state: Arc<AppState>) -> Result<Limits> {
    let limits: Limits;

    // get from active subscription
    let subscription = sqlx::query_as::<
        sqlx::Postgres,
        schemas::active_subscriptions::ActiveSubscription,
    >(r#"SELECT * FROM public.active_subscriptions WHERE user_id = $1"#)
    .bind(user_id.clone())
    .fetch_optional(&state.db)
    .await?;

    if let Some(subscription) = subscription {
        let product = get_product_by_id(state.products.clone(), &subscription.product_id)?;

        limits = Limits {
            max_tags: product.perks.max_tags.unwrap_or(ABSOLUTE_MAX_TAGS),
            max_per_domain: product.perks.max_per_domain,

            max_notes: product.perks.max_notes.unwrap_or(ABSOLUTE_MAX_NOTES),
            max_note_characters: product
                .perks
                .max_note_characters
                .unwrap_or(ABSOLUTE_MAX_CHARACTERS),
        };
    } else {
        let free_limites = products::free();

        limits = Limits {
            max_tags: free_limites.max_tags.unwrap_or(0),
            max_per_domain: free_limites.max_per_domain,

            max_notes: free_limites.max_notes.unwrap_or(0),
            max_note_characters: free_limites.max_note_characters.unwrap_or(0),
        };
    }

    Ok(limits)
}
