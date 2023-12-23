import axios, { AxiosResponse } from "axios";

import { getTokenCookie } from "@/core/popup/hooks/auth/useAuth";

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

api.interceptors.request.use(async (config) => {
  const token = await getTokenCookie();

  if (token) {
    config.headers.Authorization = `Bearer ${token.value}`;
  }

  return config;
});

export const hasError = (response: AxiosResponse<unknown, any>, error?: string) => {
  const real_response = response as AxiosResponse<ApiResponse<any>, any>;

  if (!response) {
    toast({
      title: "Could not reach server",
      description: "Please check your internet connection and, try again later",
      variant: "destructive",
    });

    return false;
  }

  // if has unknown_error, show toast
  if (
    !Array.isArray(real_response.data.errors) ||
    real_response.data.errors.some((response_error) => response_error.name === "unknown_error")
  ) {
    toast({
      title: "Unexpected error",
      description: "Please report this and, try again later",
      variant: "destructive",
    });

    return false;
  }

  return real_response.data.errors.some((response_error) => response_error.name === error);
};
