use crate::{auth::check_auth, error::Result, routes::Response, schemas, state::AppState};

use {
    axum::extract::State,
    axum::Json,
    hyper::HeaderMap,
    hyper::StatusCode,
    serde::{Deserialize, Serialize},
    sqlx::types::chrono::Utc,
    std::sync::Arc,
};

#[derive(Serialize, Deserialize)]
pub struct NotesPostBody {
    pub title: String,
    pub url: String,
    pub note: String,
    pub tags: Vec<String>,
    pub remind_at: Option<sqlx::types::chrono::DateTime<Utc>>,
}

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<NotesPostBody>,
) -> Result<Response<bool>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let note = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>(
        r#"
        INSERT INTO public.notes (title, url, note, user_id, remind_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        "#,
    )
    .bind(body.title.clone())
    .bind(body.url.clone())
    .bind(body.note.clone())
    .bind(id.clone())
    .bind(body.remind_at.clone())
    .fetch_one(&state.db)
    .await?;

    for tag_id in body.tags.clone() {
        sqlx::query(
            r#"
            INSERT INTO public.note_tags (note_id, tag_id)
            VALUES ($1, $2);
            "#,
        )
        .bind(note.id.clone())
        .bind(tag_id.clone())
        .execute(&state.db)
        .await?;
    }

    Ok(Response::new_success(StatusCode::OK, None))
}
