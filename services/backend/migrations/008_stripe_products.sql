CREATE TABLE IF NOT EXISTS public.stripe_products (
    stripe_product_id text primary key,
    name text,
    max_own number,
    storage_increase number,
    length_increase number,
    unlimited_per_domain boolean,
    changed_at timestamptz default now()
);
