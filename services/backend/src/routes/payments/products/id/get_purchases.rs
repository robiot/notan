use crate::{auth::check_auth, error::Result, routes::Response, state::AppState};

use {
    axum::extract::{Path, State},
    hyper::HeaderMap,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
    hyper::StatusCode
};

use super::ProductsIdParams;

#[derive(Serialize, Deserialize)]
pub struct ProductGetPurchasesResponse {
    pub owns: i32,
    pub max: i32,
}

// 我爱汉堡包！
pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<ProductsIdParams>,
    headers: HeaderMap,
) -> Result<Response<ProductGetPurchasesResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    // get how many times user has the product with id params.id
    let owns_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM public.product_purchases WHERE user_id = $1 AND stripe_product_id = $2;
        "#,
    )
    .bind(id.clone())
    .bind(params.product_id.clone())
    .fetch_one(&state.db)
    .await?;

    let product = sqlx::query_as::<sqlx::Postgres, crate::schemas::stripe_product::StripeProduct>(
        r#"SELECT * FROM public.stripe_products WHERE stripe_product_id = $1"#,
    )
    .bind(params.product_id.clone())
    .fetch_one(&state.db)
    .await?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(ProductGetPurchasesResponse {
            owns: owns_count as i32,
            max: product.max_own.unwrap_or(0),
        }),
    ))
}
