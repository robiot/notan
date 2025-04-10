use {crate::error::Result, serde::Deserialize};

fn default_port() -> u16 {
    8000
}

#[derive(Deserialize, Debug, Clone, Eq, PartialEq)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,

    pub database_url: String,
    pub redis_url: String,

    pub jwt_secret: String,

    pub stripe_secret_key: String,
    pub stripe_webhook_secret: String,

    pub google_oauth_client_id: String,
    pub google_oauth_client_secret: String,

    pub google_oauth_redirect_url: String,
}

pub fn get_config() -> Result<Config> {
    let config = envy::from_env::<Config>()?;
    Ok(config)
}
