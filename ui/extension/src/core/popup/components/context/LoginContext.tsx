import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/persist/useAuth";
import { api, ApiResponse, hasError } from "../../lib/api";
import { LoadScreen } from "../app/LoadScreen";
import { toast } from "../ui/use-toast";

// import { Spinner } from "@/components/ui/spinner";

export const LoginContext: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [isLoadingAuthCheck, setIsLoadingAuthCheck] = useState(true);

  useEffect(() => {
    if (!pathname.startsWith("/auth") && !auth.isAuthorized) {
      navigate("/auth/login");
      setIsLoadingAuthCheck(false);
    } else {
      setIsLoadingAuthCheck(false);
    }
  }, [auth, navigate, pathname]);

  const renewSession = useQuery({
    enabled: auth.isAuthorized,
    queryKey: ["renew_session"],
    queryFn: async () => {
      const response = await api.post<ApiResponse<{ token: string }>>("/auth/renew").catch((error: AxiosError) => {
        if (hasError(error.response, "unauthorized")) {
          toast({
            title: "Session invalid",
            variant: "destructive",
            description: "Session expired. Please sign in again.",
          });

          auth.logout();

          navigate("/auth/login");
        }
      });

      if (!response) return;

      auth.login({ token: response.data.data.token });

      return response.data;
    },
  });

  const isLoading = renewSession.isLoading || isLoadingAuthCheck;

  return (
    <>
      {isLoading && <div className="flex-1 flex-col flex items-center justify-center text-center">Loading</div>}
      <LoadScreen loading={isLoading} />
      {renewSession.isError ? (
        <div className="flex-1 flex-col flex items-center justify-center text-center">
          <span className="text-lg">Could not reach the server 😓.</span>
          <span className="text-base text-foreground/80">Check your internet connection and try again.</span>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
