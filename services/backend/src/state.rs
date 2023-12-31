use sqlx::PgPool;

use crate::{config::Config, utils::products::Product};

#[derive(Clone)]
pub struct AppState {
    pub config: Config,
    pub db: PgPool,
    pub redis: redis::Client,
    pub stripe: stripe::Client,
    pub products: Vec<Product>
}
