use crate::{auth::check_auth, error::Result, routes::Response, state::AppState};

use {
    axum::extract::{Path, State},
    hyper::HeaderMap,
    hyper::StatusCode,
    std::str::FromStr,
    std::sync::Arc,
};

use super::SubscriptionsIdParams;

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<SubscriptionsIdParams>,
    headers: HeaderMap,
) -> Result<Response<String>> {
    let _id = check_auth(headers.clone(), state.clone()).await?;

    // todo: (security) check that params.id is owned by user

    stripe::Subscription::cancel(
        &state.stripe,
        &stripe::SubscriptionId::from_str(&params.id)?,
        stripe::CancelSubscription {
            ..Default::default()
        },
    )
    .await?;

    // remove from databse
    sqlx::query(
        r#"
        DELETE FROM public.active_subscriptions
        WHERE stripe_subscription_id = $1
        "#,
    )
    .bind(&params.id)
    .execute(&state.db)
    .await?;

    Ok(Response::new_success(StatusCode::OK, None))
}
