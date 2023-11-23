use crate::{error::{Error, Result}, routes::ResponseError};
 
// function to validate username
pub fn validate_username(username: String) -> Result<()> {
    // check if username is empty
    if username.is_empty() {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Username is empty".to_string(),
            name: "username_empty".to_string(),
        }));
    }
    // check if username is too short
    if username.len() < 3 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Username is too short".to_string(),
            name: "username_short".to_string(),
        }));
    }
    // check if username is too long
    if username.len() > 16 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Username is too long".to_string(),
            name: "username_long".to_string(),
        }));
    }
    // check if username contains invalid characters
    if !username.chars().all(|c| c.is_ascii_alphanumeric() || c == '_') {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Username contains invalid characters".to_string(),
            name: "username_invalid".to_string(),
        }));
    }
    // return success
    Ok(())
}

// validate email
pub fn validate_email(email: String) -> Result<()> {
    // check if email is empty
    if email.is_empty() {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Email is empty".to_string(),
            name: "email_empty".to_string(),
        }));
    }
    // check if email is too short
    if email.len() < 3 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Email is too short".to_string(),
            name: "email_short".to_string(),
        }));
    }
    // check if email is too long
    if email.len() > 64 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Email is too long".to_string(),
            name: "email_long".to_string(),
        }));
    }
    // check if email contains invalid characters
    if !email.chars().all(|c| c.is_ascii_alphanumeric() || c == '@' || c == '.') {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Email contains invalid characters".to_string(),
            name: "email_invalid".to_string(),
        }));
    }
    // return success
    Ok(())
}

// validate password
pub fn validate_password(password: String) -> Result<()> {
    // check if password is empty
    if password.is_empty() {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Password is empty".to_string(),
            name: "password_empty".to_string(),
        }));
    }
    // check if password is too short
    if password.len() < 8 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Password is too short".to_string(),
            name: "password_short".to_string(),
        }));
    }
    // check if password is too long
    if password.len() > 64 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Password is too long".to_string(),
            name: "password_long".to_string(),
        }));
    }
    // return success
    Ok(())
}
