CREATE TABLE IF NOT EXISTS public.stripe_price_currencies (
    id varchar(255) primary key default gen_random_uuid(),
    stripe_price_id text,
    currency text,
    price bigint
);
