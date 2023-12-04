import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { toast } from "../../components/ui/use-toast";
import { api, ApiResponse } from "../../lib/api";

export type Note = {
  id: string;
  note: string;
  tags: string[];
  title: string;
  url: string;
  remind_at: string;
  created_at: string;
};

export const useNotes = () => {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Note[]>>("/notes").catch((_error: AxiosError) => {
        // TODO: make use of checkError thingy
        toast({
          title: "Error",
          variant: "destructive",
          description: "Could not fetch notes.",
        });
      });

      if (!response) return;

      return response.data.data;
    },
  });
};
