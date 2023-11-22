CREATE TABLE IF NOT EXISTS public.tags (
    id varchar(255) primary key default gen_random_uuid(),
    user_id varchar(255) references public.users(id),
    name text,
    created_at timestamptz default now()
)
