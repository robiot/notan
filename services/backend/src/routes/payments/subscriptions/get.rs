use sqlx::types::chrono;

use crate::{auth::check_auth, error::Result, routes::Response, schemas, state::AppState};

use {
    axum::extract::State,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct ProductInfo {
    pub name: String,
    pub id: String,
}

#[derive(Serialize, Deserialize)]
pub struct GetSubscriptionsResponse {
    pub stripe_subscription_id: String,
    pub start_date: chrono::DateTime<chrono::Utc>,
    pub end_date: chrono::DateTime<chrono::Utc>,
    pub product: ProductInfo,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<GetSubscriptionsResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let subscription = sqlx::query_as::<
        sqlx::Postgres,
        schemas::active_subscriptions::ActiveSubscription,
    >(r#"SELECT * FROM public.active_subscriptions WHERE user_id = $1"#)
    .bind(id)
    .fetch_optional(&state.db)
    .await?;

    if let Some(subscription) = subscription {
        let product = sqlx::query_as::<sqlx::Postgres, schemas::stripe_product::StripeProduct>(
            r#"SELECT * FROM public.stripe_products WHERE stripe_product_id = $1"#,
        )
        .bind(subscription.stripe_product_id.clone())
        .fetch_one(&state.db)
        .await?;

        Ok(Response::new_success(
            StatusCode::OK,
            Some(GetSubscriptionsResponse {
                stripe_subscription_id: subscription.stripe_subscription_id.to_string(),
                start_date: subscription.start_date,
                end_date: subscription.end_date,
                product: ProductInfo {
                    name: product.name,
                    id: product.stripe_product_id,
                },
            }),
        ))
    } else {
        Ok(Response::new_success(StatusCode::OK, None))
    }
}
