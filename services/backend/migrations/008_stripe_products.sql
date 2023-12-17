CREATE TABLE IF NOT EXISTS public.stripe_products (
    stripe_product_id text primary key,
    name text,
    max_own INT,
    storage_increase INT,
    length_increase INT,
    unlimited_per_domain boolean default false,
    changed_at timestamptz default now()
);
