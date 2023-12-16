use crate::{
    error::Result,
    routes::{payments::IntentResponse, Response},
    state::AppState,
};

use {axum::extract::State, hyper::HeaderMap, std::sync::Arc};

pub async fn handler(
    State(_state): State<Arc<AppState>>,
    _headers: HeaderMap,
    // Json(body): Json<SubscriptionSubscribeBody>,
) -> Result<Response<IntentResponse>> {
    todo!("Do this");
    // Ok(Response::new_success(StatusCode::OK, None))
}
