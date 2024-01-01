use crate::{
    error::{Error, Result},
    schemas,
    state::AppState,
    utils::payments::invoice,
};

use {
    chrono::{LocalResult, TimeZone, Utc},
    std::str::FromStr,
};

pub async fn webhook_handler(invoice: stripe::Invoice, state: &AppState) -> Result<()> {
    let customer_id = invoice::get_invoice_customer_id(invoice.clone())?;

    let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE stripe_customer_id = $1"#,
    )
    .bind(customer_id.to_string())
    .fetch_one(&state.db)
    .await?;

    for line in invoice.lines.data.iter() {
        let subscription_id = invoice::get_invoice_subscription_id(line.clone())?;
        let stripe_product_id = invoice::get_invoice_product_id(line.clone())?;

        let subscription =
            stripe::Subscription::retrieve(&state.stripe, &subscription_id.clone(), &[]).await?;

        let start_date = match Utc.timestamp_opt(subscription.start_date, 0) {
            LocalResult::Single(start_date) => start_date,
            LocalResult::Ambiguous(start_date, _) => start_date,
            LocalResult::None => {
                return Err(Error::StripeFieldNotFoundError(
                    "Invalid invoice start_date".to_string(),
                ))
            }
        };

        let end_date = match Utc.timestamp_opt(subscription.current_period_end, 0) {
            LocalResult::Single(end_date) => end_date,
            LocalResult::Ambiguous(end_date, _) => end_date,
            LocalResult::None => {
                return Err(Error::StripeFieldNotFoundError(
                    "Invalid invoice current_period_end".to_string(),
                ))
            }
        };

        // check if already exists in db, then update end_date
        let active_subscription =
            sqlx::query_as::<sqlx::Postgres, schemas::active_subscriptions::ActiveSubscription>(
                "SELECT * FROM public.active_subscriptions WHERE stripe_subscription_id = $1",
            )
            .bind(subscription.id.to_string().clone())
            .fetch_optional(&state.db)
            .await?;

        // enable automatic collection for subscription
        stripe::Subscription::update(
            &state.stripe,
            &subscription.id,
            stripe::UpdateSubscription {
                collection_method: Some(stripe::CollectionMethod::ChargeAutomatically),
                ..Default::default()
            },
        )
        .await?;

        if let Some(active_subscription) = active_subscription {
            sqlx::query(
                r#"
                UPDATE public.active_subscriptions
                SET end_date = $1
                WHERE stripe_subscription_id = $2
                "#,
            )
            .bind(end_date)
            .bind(active_subscription.stripe_subscription_id.clone())
            .execute(&state.db)
            .await?;
        } else {
            // cancel other subscriptions
            // first get all subscriptions for user

            let active_subscriptions = sqlx::query_as::<
                sqlx::Postgres,
                schemas::active_subscriptions::ActiveSubscription,
            >(
                "SELECT * FROM public.active_subscriptions WHERE user_id = $1",
            )
            .bind(user.id.clone())
            .fetch_all(&state.db)
            .await?;

            for subscription in active_subscriptions {
                stripe::Subscription::cancel(
                    &state.stripe,
                    &stripe::SubscriptionId::from_str(&subscription.stripe_subscription_id)?,
                    stripe::CancelSubscription {
                        ..Default::default()
                    },
                )
                .await?;
            }

            sqlx::query(
            r#"
                INSERT INTO public.active_subscriptions (stripe_subscription_id, user_id, product_id, start_date, end_date)
                VALUES ($1, $2, $3, $4, $5)
                "#,
            )
            .bind(subscription.id.to_string().clone())
            .bind(user.id.clone())
            .bind(stripe_product_id.to_string().clone())
            .bind(start_date)
            .bind(end_date)
            .execute(&state.db)
            .await?;
        }

        log::info!("Successfully inserted subscription to db");
    }

    Ok(())
}
