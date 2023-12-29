import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";
import { stripePromise } from "@/lib/stripe";

export const usePaySubscription = (global: {
  setAlertError: (alert: { title: string; description: string }) => void;
  onDone: () => void;
}) => {
  return useMutation({
    mutationKey: ["pay_subscription"],
    mutationFn: async (data: {
      price_id: string;
      payment_method_id: string;
    }) => {
      console.log("shiet");

      const stripe = await stripePromise;

      if (!stripe) {
        global.setAlertError({
          title: "Payment proivder not available",
          description: "Not available right now",
        });

        return;
      }

      const response = await api
        .post<
          ApiResponse<{
            client_secret: string;
          }>
        >(`/payments/buy/${data.price_id}/subscribe`, {
          payment_method_id: data.payment_method_id,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response)) {
            global.setAlertError({
              title: "Unknown error",
              description: "unknown",
            });
          }
        });

      if (!response) return;

      console.log("here 5");
      const payment = await stripe
        .confirmPayment({
          confirmParams: {
            return_url: `${window.location.href}?success=true`,
          },
          clientSecret: response.data.data.client_secret,
        })
        .catch((error) => {
          console.log(error);
        });

      console.log(payment);

      if (!payment) return;

      if (payment.error) {
        global.setAlertError({
          title: "Error",
          description: payment.error.message ?? "unknown",
        });
      }

      // global.onDone();
    },
  });
};
