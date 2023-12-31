use crate::{error::Result, schemas};

pub async fn get_price_by_price_key(
    price_key: String,
    db: &sqlx::PgPool,
) -> Result<schemas::price::Price> {
    Ok(sqlx::query_as::<sqlx::Postgres, schemas::price::Price>(
        r#"SELECT * FROM public.prices WHERE price_key = $1"#,
    )
    .bind(price_key)
    .fetch_one(db)
    .await?)
}
