import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { api } from "../../lib/api";

export type VersionInfo = {
  required_version: string;
};

export const useVersionInfo = () => {
  return useQuery({
    queryKey: ["updates_version"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<VersionInfo>>("/updates/version").catch((error: AxiosError) => {
        hasError(error.response);
      });

      if (!response) return;

      return response.data.data;
    },
  });
};
