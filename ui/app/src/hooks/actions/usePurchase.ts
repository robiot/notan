import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";

import { api } from "@/lib/api";

export const usePurchase = (global: {
  setAlertError: (alert: { title: string; description: string }) => void;
  onDone: () => void;
}) => {
  return useMutation({
    mutationKey: ["purchase"],
    mutationFn: async (data: {
      price_id: string;
      payment_method_id: string;
    }) => {
      const response = await api
        .post<ApiResponse<unknown>>(`/payments/buy/${data.price_id}/intent`, {
          payment_method_id: data.payment_method_id,
        })
        .catch((error: AxiosError) => {
          const response = error.response as AxiosResponse<
            ApiResponse<any>,
            any
          >;

          if (!response) return;

          if (hasError(error.response, "card_error")) {
            global.setAlertError({
              title: "Card declined",
              // get description from card_error
              description:
                response.data.errors.find((error) => error.name == "card_error")
                  ?.message ?? "unknown",
            });
          } else if (hasError(error.response, "payment_error")) {
            global.setAlertError({
              title: "Something went wrong with the payment",
              description:
                response.data.errors.find(
                  (error) => error.name == "payment_error"
                )?.message ?? "unknown",
            });
          }
        });

      if (!response) return;

      global.onDone();
    },
  });
};
