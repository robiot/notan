import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

export type Subscription = {
  end_date: string;
  product: {
    name: string;
    id: string;
  };
  start_date: string;
  stripe_subscription_id: string;
};

export const useActiveSubscription = () => {
  return useQuery({
    queryKey: ["active_subscription"],
    queryFn: async () => {
      const response = await api
        .get<ApiResponse<Subscription | null>>("/payments/subscriptions")
        .catch((error: AxiosError) => {
          hasError(error.response);
        });

      if (!response)
        return {
          notFound: true,
        };

      return {
        notFound: response.data.data === null,
        subscription: response.data.data,
      };
    },
  });
};
