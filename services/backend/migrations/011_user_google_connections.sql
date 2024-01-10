CREATE TABLE IF NOT EXISTS public.user_google_connections (
    -- id varchar(255) primary key default gen_random_uuid(),
    user_id varchar(255) primary key references public.users(id),
    google_user_id text
);
