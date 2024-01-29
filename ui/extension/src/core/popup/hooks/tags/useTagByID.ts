import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

import { Tag } from "./useTags";

export const useTagByID = (id: string) => {
  return useQuery({
    queryKey: ["tags", id],
    queryFn: async () => {
      // wait 2 seconds
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await api.get<ApiResponse<Tag>>(`/tags/${id}`).catch((error: AxiosError) => {
        hasError(error.response);
      });

      if (!response) return;

      return response.data.data;
    },
  });
};
