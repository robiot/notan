use crate::{
    error::Result, schemas, state::AppState,
    utils::payments::payment_intent::get_payment_intent_customer,
};

pub async fn webhook_handler(
    payment_intent: stripe::PaymentIntent,
    state: &AppState,
) -> Result<()> {
    // check if payment_intent has metadata product_id, if not return Ok(())
    let product_id = payment_intent.metadata.get("product_id");

    if product_id.is_none() {
        // not a product purchase, but a subscription. These are handled in invoice_paid
        return Ok(());
    }

    // get customer
    let customer_id = get_payment_intent_customer(payment_intent.clone())?;

    let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE stripe_customer_id = $1"#,
    )
    .bind(customer_id.to_string())
    .fetch_one(&state.db)
    .await?;

    // now insert into product purchases
    sqlx::query(
        r#"
        INSERT INTO public.owned_products (user_id, product_id)
        VALUES ($1, $2)
        "#,
    )
    .bind(user.id.clone())
    .bind(product_id.clone())
    .execute(&state.db)
    .await?;

    Ok(())
}
