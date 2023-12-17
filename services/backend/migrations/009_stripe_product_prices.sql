CREATE TABLE IF NOT EXISTS public.stripe_product_prices (
    stripe_price_id text primary key,
    stripe_product_id text,
    lookup_key text
);
