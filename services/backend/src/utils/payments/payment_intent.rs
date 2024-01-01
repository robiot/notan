use crate::error::{Error, Result};

pub fn get_payment_intent_customer(payment_intent: stripe::PaymentIntent) -> Result<stripe::CustomerId> {
    Ok(payment_intent
        .clone()
        .customer
        .clone()
        .and_then(|product| match product {
            stripe::Expandable::Id(customer) => Some(customer),
            _ => None,
        })
        .ok_or(Error::StripeFieldNotFoundError(
            "Payment intent customer expandable".to_string(),
        ))?)
}
