CREATE TABLE IF NOT EXISTS public.product_purchases (
    id varchar(255) primary key default gen_random_uuid(),
    user_id varchar(255) references public.users(id),
    product_id text,
    bought_at timestamptz default now()
);
