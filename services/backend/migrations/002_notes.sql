CREATE TABLE IF NOT EXISTS public.notes (
    id varchar(255) primary key default gen_random_uuid(),
    user_id varchar(255) references public.users(id),
    title text,
    url text,
    note text,
    remind_at timestamptz,
    created_at timestamptz default now()
);
