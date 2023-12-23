use std::sync::Arc;

use crate::{
    error::{Error, Result},
    routes::ResponseError,
    state::AppState, schemas,
};

use super::limits::Limits;

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
    if !username
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '_')
    {
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
    if !email
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '@' || c == '.')
    {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Email contains invalid characters".to_string(),
            name: "email_invalid".to_string(),
        }));
    }
    // regex check that it is an email address, needs to have an @ and a . and at least 2 character tld
    // if not match this regex, return error /^\S+@\S+\.\S+$/
    if !regex::Regex::new(r"^\S+@\S+\.\S+$")
        .unwrap()
        .is_match(&email)
    {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Email is invalid".to_string(),
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

// validate title
pub fn validate_title(title: String) -> Result<()> {
    // check if title is empty
    if title.is_empty() {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Title is empty".to_string(),
            name: "title_empty".to_string(),
        }));
    }
    // check if title is too long
    if title.len() > 250 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Title is too long".to_string(),
            name: "title_long".to_string(),
        }));
    }

    Ok(())
}

// validate note
pub fn validate_note_body(note: String, limits: Limits) -> Result<()> {
    // check if note is too long
    if note.len() > limits.max_note_length as usize {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Note is too long".to_string(),
            name: "note_long".to_string(),
        }));
    }

    Ok(())
}

// validate url
pub fn validate_url(url: String) -> Result<()> {
    // check if url is empty
    if url.is_empty() {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Url is empty".to_string(),
            name: "url_empty".to_string(),
        }));
    }
    // check if url is too long
    if url.len() > 250 {
        return Err(Error::UnprocessableEntity(ResponseError {
            message: "Url is too long".to_string(),
            name: "url_long".to_string(),
        }));
    }

    Ok(())
}

pub async fn validate_url_usage(
    url: String,
    limits: Limits,
    user_id: String,
    state: &Arc<AppState>,
) -> Result<()> {
    // check if url is empty
    let url = match url::Url::parse(&url) {
        Ok(url) => url,
        Err(_) => {
            return Err(Error::UnprocessableEntity(ResponseError {
                message: "Url is invalid".to_string(),
                name: "url_invalid".to_string(),
            }));
        }
    };
    let domain = match url.domain() {
        Some(domain) => domain,
        None => {
            return Err(Error::UnprocessableEntity(ResponseError {
                message: "Url is invalid".to_string(),
                name: "url_invalid".to_string(),
            }));
        }
    };

    if !limits.has_unlimited_notes_per_domain {
        let mut count: i32 = 0;

        let notes = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>(
            r#"SELECT * FROM public.notes WHERE user_id = $1"#,
        )
        .bind(user_id.clone())
        .fetch_all(&state.db)
        .await?;

        for note in notes {
            let note_url = match url::Url::parse(&note.url) {
                Ok(url) => url,
                Err(_) => {
                    return Err(Error::UnprocessableEntity(ResponseError {
                        message: "Url is invalid".to_string(),
                        name: "url_invalid".to_string(),
                    }));
                }
            };
            let note_domain = match note_url.domain() {
                Some(domain) => domain,
                None => {
                    return Err(Error::UnprocessableEntity(ResponseError {
                        message: "Url is invalid".to_string(),
                        name: "url_invalid".to_string(),
                    }));
                }
            };

            if domain == note_domain {
                count += 1;
            }
        }

        if count >= 10 {
            return Err(Error::UnprocessableEntity(ResponseError {
                message: "Limit has been reached for domain".to_string(),
                name: "max_notes_for_domain".to_string(),
            }));
        }
    }
    Ok(())
}
