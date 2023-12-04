use crate::{
    auth::check_auth,
    error::Result,
    routes::Response,
    schemas,
    state::AppState,
    utils::database::tags::get_all_tags_for_note,
};

use super::NotesGetResponseItem;

use {axum::extract::State, hyper::HeaderMap, hyper::StatusCode, std::sync::Arc};

pub async fn handler(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
) -> Result<Response<Vec<NotesGetResponseItem>>> {
    let id = check_auth(headers.clone(), state.clone()).await?;

    let mut result: Vec<NotesGetResponseItem> = Vec::new();

    let notes = sqlx::query_as::<sqlx::Postgres, schemas::note::Note>(
        r#"SELECT * FROM public.notes WHERE user_id = $1"#,
    )
    .bind(id.clone())
    .fetch_all(&state.db)
    .await?;

    for note in notes {
        let tags = get_all_tags_for_note(note.id.clone(), &state.db).await?;

        result.push(NotesGetResponseItem {
            id: note.id,
            title: note.title,
            url: note.url,
            note: note.note,
            tags,
            remind_at: note.remind_at,
            created_at: note.created_at,
        })
    }

    Ok(Response::new_success(StatusCode::OK, Some(result)))
}
