import { Appearance, loadStripe } from "@stripe/stripe-js";

import { enviroment } from "./enviroment";

export const stripePromise = loadStripe(enviroment.STRIPE_PUBLIC_KEY);

export const StripeAppearance: Appearance = {
  variables: {
    colorPrimary: "#E3E3E3",
    colorBackground: "#25282D",
    colorText: "#E3E3E3",
    colorDanger: "#FF4D4D",
    focusBoxShadow: "0 0 0 1px black",
    focusOutline: "none",
    fontFamily: "Ideal Sans, system-ui, sans-serif",
    borderRadius: "4px",
  },
};
