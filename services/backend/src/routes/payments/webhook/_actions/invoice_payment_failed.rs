use crate::{error::Result, state::AppState, utils::payments::invoice};

pub async fn webhook_handler(invoice: stripe::Invoice, state: &AppState) -> Result<()> {
    // if billing_reason is SubscriptionCreate, then we don't need to cancel the subscription, since it will automatically be removed afterwards
    if invoice.billing_reason == Some(stripe::InvoiceBillingReason::SubscriptionCreate)
    {
        return Ok(());
    }

    for line in invoice.lines.data.iter() {
        let subscription_id = invoice::get_invoice_subscription_id(line.clone())?;

        stripe::Subscription::cancel(
            &state.stripe,
            &subscription_id,
            stripe::CancelSubscription {
                at_period_end: Some(false),
            },
        )
        .await?;

        log::info!(
            "Successfully canceled subscription {} because of failed payment",
            subscription_id.to_string()
        );
    }

    Ok(())
}
