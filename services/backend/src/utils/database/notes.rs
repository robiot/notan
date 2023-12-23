use sqlx::{Pool, Postgres};

use crate::error::Result;

// Check if user already exists with username
pub async fn get_note_count(id: String, pool: &Pool<Postgres>) -> Result<i64> {
    Ok(sqlx::query_scalar(
        r#"
        SELECT COUNT(*) FROM public.notes WHERE user_id = $1;
        "#,
    )
    .bind(id.clone())
    .fetch_one(pool)
    .await?)
}
