use crate::{
    auth::check_auth,
    error::Result,
    routes::{notes::NoteDataBody, Response},
    state::AppState,
};

use {
    axum::extract::{Path, State},
    hyper::HeaderMap,
    std::sync::Arc,
    axum::Json
};

use super::ProductsIdParams;

pub async fn handler(
    State(state): State<Arc<AppState>>,
    Path(_params): Path<ProductsIdParams>,
    headers: HeaderMap,
    Json(_body): Json<NoteDataBody>,
) -> Result<Response<String>> {
    let _id = check_auth(headers.clone(), state.clone()).await?;

    // https://stripe.com/docs/api/payment_intents/create
    // receipt_email
    // currency_eur
    // confirm
    // customer: customerid
    todo!("do this");
}
