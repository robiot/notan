use serde::{Deserialize, Serialize};
use sqlx::types::chrono;

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub verified_mail: bool,
    pub username: String,
    pub email: String,
    pub password: String,
    pub ip: String,
    pub stripe_customer_id: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
}
