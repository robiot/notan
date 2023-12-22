"use client";

import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

import { LoadScreen } from "../common/LoadScreen";

// import { Spinner } from "@/components/ui/spinner";

export const LoginContext: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const router = useRouter();
  const path = usePathname();

  const [isLoadingAuthCheck, setIsLoadingAuthCheck] = useState(true);

  useEffect(() => {
    if (path !== "/login" && path !== "/signup" && !auth.token) {
      router.push("/login");
    } else {
      setIsLoadingAuthCheck(false);
    }
  }, [auth, router, path]);

  const renewSession = useQuery({
    enabled: auth.token !== undefined,
    queryKey: ["renew_session"],
    queryFn: async () => {
      const response = await api
        .post<ApiResponse<{ token: string }>>("/auth/renew")
        .catch((error: AxiosError) => {
          if (hasError(error.response, "unauthorized")) {
            toast({
              title: "Session invalid",
              variant: "destructive",
              description: "Session expired. Please sign in again.",
            });

            auth.logout();

            router.push("/login");
          }
        });

      if (!response) return;

      auth.login(response.data.data.token);

      return response.data;
    },
  });

  const isLoading = isLoadingAuthCheck || renewSession.isLoading;

  return (
    <>
      <LoadScreen loading={isLoading} />
      {renewSession.isError ? (
        <div className="flex-1 flex-col flex items-center justify-center text-center">
          <span className="text-lg">Could not reach the server 😓.</span>
          <span className="text-base text-foreground/80">
            Check your internet connection and try again.
          </span>
        </div>
      ) : (
        <>{!isLoading && children}</>
      )}
    </>
  );
};
