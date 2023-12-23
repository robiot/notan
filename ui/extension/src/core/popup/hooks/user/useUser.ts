import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "../../lib/api";

type User = {
  id: string;
  email: string;
  username: string;
  verified_mail: boolean;

  max_note_length: number;
  total_note_storage: number;
  used_note_storage: number;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<User>>("/users/@me").catch((error: AxiosError) => {
        hasError(error.response);
      });

      if (!response) return;

      return response.data.data;
    },
  });
};
