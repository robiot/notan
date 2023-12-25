import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

// "card": {
//     "brand": "visa",
//     "exp": "2/2026",
//     "last_four": "0341"
// },
// "id": "card_1OPAD2LdGhPNcQTv15MYXqMY",
// "kind": "card"
export type PaymentMethod = {
  id: string;
  kind: "card";
  card?: {
    brand: string;
    exp: string;
    last_four: string;
  };
};

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const response = await api
        .get<ApiResponse<PaymentMethod[]>>("/payments/methods")
        .catch((error: AxiosError) => {
          hasError(error.response);
        });

      if (!response) return;

      return response.data.data;
    },
  });
};

export const usePaymentMethodById = (id: string) => {
  const { data: methods } = usePaymentMethods();

  return getPaymentMethodById(id, methods);
};

export const getPaymentMethodById = (id: string, methods?: PaymentMethod[]) => {
  return methods?.find((method) => method.id === id);
};
