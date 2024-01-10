use serde::{Deserialize, Serialize};

#[derive(sqlx::FromRow, Debug, Serialize, Deserialize)]
pub struct UserGoogleConnection {
    pub user_id: String,
    pub google_user_id: String,
}
