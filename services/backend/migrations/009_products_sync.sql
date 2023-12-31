CREATE TABLE IF NOT EXISTS public._products_sync (
    id varchar(255) primary key default gen_random_uuid(),
    hash text,
    installed_at timestamptz default now()
);
