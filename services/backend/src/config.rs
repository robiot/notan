use {crate::error::Result, serde::Deserialize};

fn default_db() -> String {
    "postgres://postgres:root@postgres:5432/postgres".to_string()
}

#[derive(Deserialize, Debug, Clone, Eq, PartialEq)]
pub struct Config {
    pub port: u16,

    #[serde(default = "default_db")]
    pub database_url: String,
    pub redis_url: String,

    pub jwt_secret: String,
}

pub fn get_config() -> Result<Config> {
    let config = envy::from_env::<Config>()?;
    Ok(config)
}
