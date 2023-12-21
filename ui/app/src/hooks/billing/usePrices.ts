import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

export type Price = {
  lookup_key: string;
  price: number;
  price_id: string;
  product_id: string;
};

export const usePrices = () => {
  return useQuery({
    queryKey: ["prices"],
    queryFn: async () => {
      const response = await api
        .get<ApiResponse<Price[]>>("/payments/prices")
        .catch((error: AxiosError) => {
          hasError(error.response);
        });

      if (!response) return;

      return response.data.data;
    },
  });
};
