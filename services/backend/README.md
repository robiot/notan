# Notan Backend.rs
----

The backend handling everything.

## Setup stripe locally
1. Install the cli https://stripe.com/docs/stripe-cli?shell=true#login-account
2. Run `stripe login`
3. Run `stripe listen --forward-to localhost:8000/payments/webhook`
4. Copy webhook key, paste into STRIPE_WEBHOOK_SECRET `../../.env`
