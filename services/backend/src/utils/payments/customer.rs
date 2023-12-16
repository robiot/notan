use std::str::FromStr;

use crate::{error::Result, schemas, state::AppState};

use std::sync::Arc;

/**
 * Returns the Stripe customer object for the signed in user
 * creates a stripe customer if one does not exist
 */
pub async fn get_stripe_customer_by_user_id(
    user_id: String,
    state: Arc<AppState>,
) -> Result<stripe::Customer> {
    // check if user with id has a stripe_customer_id
    let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE id = $1"#,
    )
    .bind(user_id.clone())
    .fetch_one(&state.db)
    .await?;

    let customer: stripe::Customer = if let Some(stripe_customer_id) = user.stripe_customer_id {
        stripe::Customer::retrieve(
            &state.stripe,
            &stripe::CustomerId::from_str(stripe_customer_id.as_str())?,
            &[],
        )
        .await?
    } else {
        let customer = stripe::Customer::create(
            &state.stripe,
            stripe::CreateCustomer {
                email: Some(&user.email),
                ..Default::default()
            },
        )
        .await?;

        // update user with stripe_customer_id
        sqlx::query(
            r#"
            UPDATE public.users
            SET stripe_customer_id = $1
            WHERE id = $2;
            "#,
        )
        .bind(customer.id.as_str())
        .bind(user_id.clone())
        .execute(&state.db)
        .await?;

        customer
    };

    Ok(customer)
}
