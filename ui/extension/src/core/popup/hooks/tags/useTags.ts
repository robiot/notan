import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

export type Tag = {
  color: "red" | "orange" | "green" | "blue" | "purple" | "pink" | "gray";
  created_at: string;
  id: string;
  name: string;
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      // sleep for 1 second

      // await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await api.get<ApiResponse<Tag[]>>("/tags").catch((error: AxiosError) => {
        hasError(error.response);
      });

      if (!response) return;

      return response.data.data;
    },
  });
};
