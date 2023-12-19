use crate::error::{Error, Result};

pub fn get_invoice_product_id(line: stripe::InvoiceLineItem) -> Result<stripe::ProductId> {
    Ok(line
        .clone()
        .price
        .ok_or(Error::StripeFieldNotFoundError("Line price".to_string()))?
        .product
        .clone()
        .and_then(|product| match product {
            stripe::Expandable::Id(product) => Some(product),
            _ => None,
        })
        .ok_or(Error::StripeFieldNotFoundError(
            "Price product expandable".to_string(),
        ))?)
}

pub fn get_invoice_subscription_id(line: stripe::InvoiceLineItem) -> Result<stripe::SubscriptionId> {
    Ok(line
        .subscription
        .clone()
        .and_then(|subscription| match subscription {
            stripe::Expandable::Id(subscription) => Some(subscription),
            _ => None,
        })
        .ok_or(Error::StripeFieldNotFoundError(
            "Invoice subscription expandable".to_string(),
        ))?)
}

pub fn get_invoice_customer_id(invoice: stripe::Invoice) -> Result<stripe::CustomerId> {
    Ok(invoice
        .customer
        .clone()
        .and_then(|customer| match customer {
            stripe::Expandable::Id(customer) => Some(customer),
            _ => None,
        })
        .ok_or(Error::StripeFieldNotFoundError(
            "Invoice customer expandable".to_string(),
        ))?)
}