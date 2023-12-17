CREATE TABLE IF NOT EXISTS public.active_subscriptions (
    stripe_subscription_id text primary key,
    user_id varchar(255) references public.users(id),
    start_date timestamptz,
    end_date timestamptz,
    created_at timestamptz default now()
);
