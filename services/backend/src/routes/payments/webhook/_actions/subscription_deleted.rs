use crate::{error::Result, state::AppState};

pub async fn webhook_handler(subscription: stripe::Subscription, state: &AppState) -> Result<()> {
    sqlx::query(
        r#"
        DELETE FROM public.active_subscriptions
        WHERE stripe_subscription_id = $1
        "#,
    )
    .bind(subscription.id.to_string().clone())
    .execute(&state.db)
    .await?;

    log::info!("Successfully deleted subscription from db");

    Ok(())
}
