CREATE TABLE IF NOT EXISTS public.subscriptions (
    id varchar(255) primary key default gen_random_uuid(),
    user_id varchar(255) references public.users(id),
    plan_id text,
    status text,
    start_date timestamptz,
    end_date timestamptz,
    created_at timestamptz default now()
);
