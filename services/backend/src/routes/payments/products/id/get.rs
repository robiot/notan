use crate::{auth::check_auth, error::Result, routes::Response, state::AppState, utils::products::utils::get_product_by_id};

use {
    axum::extract::{Path, State},
    hyper::HeaderMap,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
    hyper::StatusCode
};

use super::ProductsIdParams;

#[derive(Serialize, Deserialize)]
pub struct ProductGetResponse {
    pub product_id: String,
    pub name: String,
    pub owns: i32,
    pub max: i32,
}

// 我爱汉堡包！
pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(params): Path<ProductsIdParams>,
    headers: HeaderMap,
) -> Result<Response<ProductGetResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    // get how many times user has the product with id params.id
    let owns_count: i64 = sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM public.owned_products WHERE user_id = $1 AND product_id = $2;
        "#,
    )
    .bind(id.clone())
    .bind(params.product_id.clone())
    .fetch_one(&state.db)
    .await?;

    let product = get_product_by_id(state.products.clone(), &params.product_id)?;

    Ok(Response::new_success(
        StatusCode::OK,
        Some(ProductGetResponse {
            product_id: product.id,
            name: product.title,
            owns: owns_count as i32,
            max: product.max_own.unwrap_or(0),
        }),
    ))
}
