CREATE TABLE IF NOT EXISTS public.users (
    id varchar(255) primary key default gen_random_uuid(),
    verified_mail boolean,
    username text,
    email text,
    password text,
    ip text,
    created_at timestamptz default now()
);
