import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

export type Product = {
  product_id: string;
  name: string;
  owns: number;
  max: number;
};

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await api
        .get<ApiResponse<Product>>(`/payments/products/${id}`)
        .catch((error: AxiosError) => {
          hasError(error.response);
        });

      if (!response) return;

      return response.data.data;
    },
  });
};
