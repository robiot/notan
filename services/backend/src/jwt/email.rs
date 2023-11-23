use crate::error::{Result, Error};

use super::normalize_timestamp;

use {
    jsonwebtoken::{Validation, encode, Header, EncodingKey, decode, DecodingKey},
    serde::{Deserialize, Serialize},
    time::{Duration, OffsetDateTime},
};

#[derive(Debug, Serialize, Deserialize)]
pub struct Email {
    pub aud: String, // Audience
    pub exp: usize,  // Expiration time (as UTC timestamp)
    pub iat: usize,  // Issued at (as UTC timestamp)
    pub sid: String,  // Userid
}

impl Email {
    pub fn generate(sid: &str, secret: &str) -> Result<String> {
        let header = &Header::default();
        
        let iat = OffsetDateTime::now_utc();
        let exp = iat + Duration::days(7);

        let user = Email {
            aud: "email-signup".to_string(),
            iat: normalize_timestamp(iat)?,
            exp: normalize_timestamp(exp)?,
            sid: sid.to_string(),
        };

        let token = encode(&header, &user, &EncodingKey::from_secret(secret.as_ref()))?;

        Ok(token)
    }

    pub fn decode(token: &str, secret: &str) -> Result<Email> {
        let validation = Validation::default();

        let token = decode::<Email>(&token, &DecodingKey::from_secret(secret.as_ref()), &validation)?;

        if token.claims.aud != "email-signup".to_string() {
            return Err(Error::InvalidTokenType)
        }

        Ok(token.claims)
    }
}