/* eslint-disable unicorn/prefer-ternary */
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";
import { stripePromise } from "@/lib/stripe";

export const useBuy = (global: {
  setAlertError: (alert: { title: string; description: string }) => void;
}) => {
  return useMutation({
    mutationKey: ["pay_price"],
    mutationFn: async (data: {
      price_key: string;
      payment_method_id: string;
      product_id: string;
      payment_type: "subscribe" | "intent";
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
        >(`/payments/buy/${data.price_key}/${data.payment_type}`, {
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
            return_url: `${window.location.href}?success=true&product_id=${data.product_id}&payment_type=${data.payment_type}`,
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
