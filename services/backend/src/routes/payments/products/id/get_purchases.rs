use crate::{
    auth::check_auth,
    error::Result,
    routes::{payments::IntentResponse, Response},
    state::AppState,
    utils::payments::customer,
};

use {
    axum::extract::{Path, State},
    axum::Json,
    hyper::HeaderMap,
    serde::{Deserialize, Serialize},
    std::sync::Arc,
};

use super::ProductsIdParams;

#[derive(Serialize, Deserialize)]
pub struct SubscriptionSubscribeBody {
    // card has to be created before
    pub card_token: String,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(_params): Path<ProductsIdParams>,
    headers: HeaderMap,
    Json(_body): Json<SubscriptionSubscribeBody>,
) -> Result<Response<IntentResponse>> {
    let id = check_auth(headers.clone(), state.clone()).await?;
    let _customer = customer::get_stripe_customer_by_user_id(id.clone(), state.clone()).await?;

    todo!("Do this");
    // Ok(Response::new_success(
    //     StatusCode::OK,
    //     Some(IntentResponse { client_secret }),
    // ))
}
