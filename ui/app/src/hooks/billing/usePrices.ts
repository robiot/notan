import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

export type Price = {
  price_key: string;
  product_id: string;
  price: number;
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
