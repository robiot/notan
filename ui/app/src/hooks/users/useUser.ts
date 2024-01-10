import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "@/lib/api";

type User = {
  id: string;
  email: string;
  username?: string;
  verified_mail: boolean;

  is_connected_google: boolean;

  max_note_length: number;
  total_note_storage: number;
  used_note_storage: number;
  has_unlimited_notes_per_domain: boolean;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    refetchInterval: 5000,
    queryFn: async () => {
      const response = await api
        .get<ApiResponse<User>>("/users/@me")
        .catch((error: AxiosError) => {
          hasError(error.response);
        });

      if (!response) return;

      return response.data.data;
    },
  });
};
