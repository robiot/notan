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
}

pub fn get_config() -> Result<Config> {
    let config = envy::from_env::<Config>()?;
    Ok(config)
}
