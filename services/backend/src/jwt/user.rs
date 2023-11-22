use crate::error::{Result, Error};

use super::normalize_timestamp;

use {
    jsonwebtoken::{Validation, encode, Header, EncodingKey, decode, DecodingKey},
    serde::{Deserialize, Serialize},
    time::{Duration, OffsetDateTime},
};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub aud: String, // Audience
    pub exp: usize,  // Expiration time (as UTC timestamp)
    pub iat: usize,  // Issued at (as UTC timestamp)
    pub id: String,  // Userid
}

impl User {
    pub fn generate(user_id: &str, secret: &str) -> Result<String> {
        let header = &Header::default();
        
        let iat = OffsetDateTime::now_utc();
        let exp = iat + Duration::days(7);

        let user = User {
            aud: "user".to_string(),
            iat: normalize_timestamp(iat)?,
            exp: normalize_timestamp(exp)?,
            id: user_id.to_string(),
        };

        let token = encode(&header, &user, &EncodingKey::from_secret(secret.as_ref()))?;

        Ok(token)
    }

    pub fn decode(token: &str, secret: &str) -> Result<User> {
        let validation = Validation::default();

        let token = decode::<User>(&token, &DecodingKey::from_secret(secret.as_ref()), &validation)?;

        if token.claims.aud != "user".to_string() {
            return Err(Error::InvalidTokenType)
        }

        Ok(token.claims)
    }
}