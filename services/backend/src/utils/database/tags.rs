use sqlx::{Pool, Postgres};

use crate::{
    error::Result,
    routes::notes::TagItem,
    schemas::{self, tag},
};

pub async fn connect_tags_to_note(
    note_id: String,
    tag_ids: Vec<String>,
    pool: &Pool<Postgres>,
) -> Result<()> {
    for tag_id in tag_ids {
        sqlx::query(
            r#"
            INSERT INTO public.note_tags (note_id, tag_id)
            VALUES ($1, $2);
            "#,
        )
        .bind(note_id.clone())
        .bind(tag_id.clone())
        .execute(pool)
        .await?;
    }

    Ok(())
}

pub async fn get_all_tags_for_note(note_id: String, pool: &Pool<Postgres>) -> Result<Vec<TagItem>> {
    let mut tags: Vec<TagItem> = Vec::new();

    let tags_for_note = sqlx::query_as::<sqlx::Postgres, schemas::note_tag::NoteTag>(
        r#"SELECT * FROM public.note_tags WHERE note_id = $1"#,
    )
    .bind(note_id)
    .fetch_all(pool)
    .await?;

    for tag_for_note in tags_for_note {
        let tag = sqlx::query_as::<sqlx::Postgres, tag::Tag>(
            r#"SELECT * FROM public.tags WHERE id = $1"#,
        )
        .bind(tag_for_note.tag_id.clone())
        .fetch_one(pool)
        .await?;

        tags.push(TagItem {
            id: tag.id,
            name: tag.name,
        })
    }

    Ok(tags)
}
