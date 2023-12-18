use hyper::StatusCode;

use crate::{
    error::{Error, Result},
    routes::{Response, ResponseError},
    state::AppState,
};

use {
    axum::extract::State,
    hyper::HeaderMap,
    std::sync::Arc,
    stripe::{EventObject, EventType},
};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    body: axum::body::Bytes,
) -> Result<Response<String>> {
    let signature = if let Some(sig) = headers.get("stripe-signature") {
        sig.to_owned()
    } else {
        return Err(Error::BadRequest(ResponseError {
            message: "No signature".to_string(),
            name: "no_sig".to_string(),
        }));
    };
    let body = match std::str::from_utf8(&body) {
        Ok(body) => body,
        Err(error) => {
            return Err(Error::BadRequest(ResponseError {
                message: error.to_string(),
                name: "invalid_body".to_string(),
            }))
        }
    };

    // println!("Received webhook: {:?}", body);

    let event = match stripe::Webhook::construct_event(
        body,
        signature.to_str().unwrap(),
        &state.config.stripe_webhook_secret,
    ) {
        Ok(event) => event,
        Err(e) => {
            log::warn!("Failed to parse webhook: {:?}", e);
            return Ok(Response::new_success(StatusCode::OK, None));
            // return Err(Error::BadRequest(ResponseError {
            //     message: e.to_string(),
            //     name: "invalid_webhook".to_string(),
            // }))
        }
    };

    match event.type_ {
        EventType::PaymentIntentSucceeded => {
            // todo: finish this
            if let EventObject::PaymentIntent(intent) = event.data.object {
                // insert product purchase into db
                // println!("Received payment intent success: {:?}", intent);

                let _user = sqlx::query_as::<sqlx::Postgres, crate::schemas::user::User>(
                    r#"SELECT * FROM public.users WHERE id = $1"#,
                )
                .bind(intent.metadata.get("user_id").unwrap())
                .fetch_one(&state.db)
                .await?;

                // println!("Received payment intent done: {:?}", intent.);
            }
        }
        // EventType::AccountUpdated => {
        //     if let EventObject::Account(account) = event.data.object {
        //         println!(
        //             "Received account updated webhook for account: {:?}",
        //             account.id
        //         );
        //     }
        // }
        _ => log::trace!("Unknown event encountered in webhook: {:?}", event.type_),
    }

    // todo!("Do this");
    // event
    // intent paid -> save to db
    // subscription created,paid -> save to db
    // subscription canceled -> delete from db
    Ok(Response::new_success(StatusCode::OK, None))
}
