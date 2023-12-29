// import { useAuth } from "@popup/hooks/persist/useAuth";
import axios, { AxiosInstance, AxiosResponse } from "axios";

import { toast } from "@notan/components/ui/use-toast";
// import { enviroment } from "./enviroment";

export type ApiResponse<T> = {
  data: T;
  errors: {
    name: string;
    message: string;
  }[];
  status: "SUCCESS" | "FAILURE";
};

export const getDescriptionForError = (error_name: string, errors: ApiResponse<unknown>["errors"]) => {
  return errors.find(
    (error) => error.name == error_name
  )?.message ?? "unknown";
};

export const hasError = (
  response: AxiosResponse<unknown, any> | undefined,
  error?: string
) => {
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
    real_response.data.errors.some(
      (response_error) => response_error.name === "unknown_error"
    )
  ) {
    toast({
      title: "Unexpected error",
      description: "Please report this and, try again later",
      variant: "destructive",
    });

    return false;
  }

  if (
    real_response.data.errors.some(
      (response_error) => response_error.name === "rate_limited"
    )
  ) {
    toast({
      title: "Rate limited",
      description: "You are sending too many requests. Please try again later.",
      variant: "destructive",
    });

    return false;
  }

  return real_response.data.errors.some(
    (response_error) => response_error.name === error
  );
};
