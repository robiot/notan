import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "../../lib/api";

export type Note = {
  id: string;
  note: string;
  tags: string[];
  title: string;
  url?: string;
  remind_at: string;
  created_at: string;
};

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Note[]>>("/notes").catch((error: AxiosError) => {
        hasError(error.response);
      });

      // wait 500ms
      // await new Promise((resolve) => setTimeout(resolve, 600));

      if (!response) return;

      return response.data.data;
    },
  });
};
