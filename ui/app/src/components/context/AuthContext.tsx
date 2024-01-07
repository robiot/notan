"use client";

import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState, useTransition } from "react";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

import { LoadScreen } from "../common/LoadScreen";

export const AuthContext: FC<{ children: ReactNode; type: "auth" | "app" }> = ({
  children,
  type,
}) => {
  const router = useRouter();
  const auth = useAuth();
  const path = usePathname();

  const [isPending, startTransition] = useTransition();
  const [shouldLoad, setShouldLoad] = useState(true);

  useEffect(() => {
    if (type === "auth" && auth.token) {
      startTransition(() => {
        router.push("/");
      });
    } else if (type === "app" && !auth.token) {
      startTransition(() => {
        router.push("/login");
      });
    } else {
      setShouldLoad(false);
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

  const isLoading = shouldLoad || isPending || renewSession.isLoading;

  return (
    <>
      <LoadScreen loading={isLoading} />

      {!isLoading && children}
    </>
  );
};
