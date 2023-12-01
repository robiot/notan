import { useAuth } from "@popup/hooks/persist/useAuth";
import axios, { AxiosResponse } from "axios";

import { toast } from "../components/ui/use-toast";
import { enviroment } from "./enviroment";

export type ApiResponse<T> = {
  data: T;
  errors: {
    name: string;
    message: string;
  }[];
  status: "SUCCESS" | "FAILURE";
};

export const api = axios.create({
  baseURL: enviroment.API_URL,
  timeout: 30_000,
});

api.interceptors.request.use((config) => {
  const { token } = useAuth.getState();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const hasError = (response: AxiosResponse<unknown, any>, error: string) => {
  const real_response = response as AxiosResponse<ApiResponse<any>, any>;

  if (!response || !Array.isArray(real_response.data.errors)) {
    console.log("Invalid api response");

    toast({
      title: "Unexpected error",
      description: "Please report this and, try again later",
    });

    return false;
  }

  return real_response.data.errors.some((response_error) => response_error.name === error);
};
