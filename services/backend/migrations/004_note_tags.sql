CREATE TABLE IF NOT EXISTS public.note_tags (
    id varchar(255) primary key default gen_random_uuid(),
    note_id varchar(255) references public.notes(id),
    tag_id varchar(255) references public.tags(id),
    created_at timestamptz default now()
)
