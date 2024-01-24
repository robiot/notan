use crate::{
    error::{Error, Result},
    routes::{Response, ResponseError},
    state::AppState,
};

use {
    axum::extract::State,
    // sqlx::types::chrono::{TimeZone, DateTime, Utc},
    hyper::HeaderMap,
    hyper::StatusCode,
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

    let event = match stripe::Webhook::construct_event(
        body,
        signature.to_str().unwrap_or(""),
        &state.config.stripe_webhook_secret,
    ) {
        Ok(event) => event,
        Err(e) => {
            // log::info!("body: {}", body);
            log::warn!("Failed to parse webhook: {:?}", e);
            return Ok(Response::new_success(StatusCode::OK, None));
            // return Err(Error::BadRequest(ResponseError {
            //     message: e.to_string(),
            //     name: "invalid_webhook".to_string(),
            // }))
        }
    };

    match event.type_ {
        EventType::InvoicePaid => {
            if let EventObject::Invoice(invoice) = event.data.object {
                super::_actions::invoice_paid::webhook_handler(invoice, &state).await?;
            }
        }
        EventType::InvoicePaymentFailed | EventType::InvoiceFinalizationFailed => {
            if let EventObject::Invoice(invoice) = event.data.object {
                super::_actions::invoice_payment_failed::webhook_handler(invoice, &state).await?;
            }
        }
        EventType::CustomerSubscriptionDeleted => {
            if let EventObject::Subscription(subscription) = event.data.object {
                super::_actions::subscription_deleted::webhook_handler(subscription, &state)
                    .await?;
            }
        }
        EventType::PaymentIntentSucceeded => {
            if let EventObject::PaymentIntent(payment_intent) = event.data.object {
                super::_actions::payment_intent_succeeded::webhook_handler(payment_intent, &state)
                    .await?;
            }
        }
        // subscription paid -> save to db
        // subscription canceled -> delete from db
        _ => log::trace!("Unknown event encountered in webhook: {:?}", event.type_),
    }

    Ok(Response::new_success(StatusCode::OK, None))
}
