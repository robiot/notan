CREATE TABLE IF NOT EXISTS public.stripe_product_prices (
    stripe_product_id text primary key,
    stripe_price_id text,
);
