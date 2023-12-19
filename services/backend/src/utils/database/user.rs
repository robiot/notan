use sqlx::{Pool, Postgres};

use crate::{
    error::{Error, Result},
    routes::ResponseError,
    schemas,
};

// Check if user already exists with username
pub async fn check_username_taken(username: String, pool: &Pool<Postgres>) -> Result<()> {
    match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE username = $1"#,
    )
    .bind(username.clone())
    .fetch_optional(pool)
    .await
    {
        Ok(user) => {
            if user.is_some() {
                return Err(Error::UnprocessableEntity(ResponseError {
                    message: "Another account with this username already exists".to_string(),
                    name: "username_exists".to_string(),
                }));
            }
        }
        Err(error) => return Err(error.into()),
    };

    Ok(())
}

// Check if user already exists with email
pub async fn check_email_taken(email: String, pool: &Pool<Postgres>) -> Result<()> {
    match sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
        r#"SELECT * FROM public.users WHERE email = $1"#,
    )
    .bind(email.clone())
    .fetch_optional(pool)
    .await
    {
        Ok(user) => {
            if user.is_some() {
                return Err(Error::UnprocessableEntity(ResponseError {
                    message: "Another account with this mail already exists".to_string(),
                    name: "email_exists".to_string(),
                }));
            }
        }
        Err(error) => return Err(error.into()),
    };

    Ok(())
}

// pub async fn get_user_by_id(id: String, pool: &Pool<Postgres>) -> Result<schemas::user::User> {
//     let user = sqlx::query_as::<sqlx::Postgres, schemas::user::User>(
//         r#"SELECT * FROM public.users WHERE id = $1"#,
//     )
//     .bind(id.clone())
//     .fetch_one(pool)
//     .await?;

//     Ok(user)
// }
