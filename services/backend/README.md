# Notan Backend.rs
----

The backend handling everything.

## Stripe
Stripe cli will run in docker-compose. Grab the webhook url and put it into the ../../.env and restart docker-compose

## Setup stripe locally (not required)
1. Install the cli https://stripe.com/docs/stripe-cli?shell=true#login-account
2. Run `stripe login`
3. Run `stripe listen --forward-to localhost:8000/payments/webhook`
4. Copy webhook key, paste into STRIPE_WEBHOOK_SECRET `../../.env`
