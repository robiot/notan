import { cn } from "@popup/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/persist/useAuth";
import { api, ApiResponse, hasError } from "../../lib/api";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/use-toast";

// import { Spinner } from "@/components/ui/spinner";

export const LoginContext: FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [isLoadingAuthCheck, setIsLoadingAuthCheck] = useState(true);

  useEffect(() => {
    if (!pathname.startsWith("/auth") && !auth.isAuthorized) {
      navigate("/login");
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

          navigate("/login");
        }
      });

      if (!response) return;

      auth.login({ token: response.data.data.token });
    },
  });

  const isLoading = renewSession.isLoading || isLoadingAuthCheck;

  return (
    <>
      <motion.div
        className={cn("z-50 fixed h-full w-full bg-background flex items-center justify-center pointer-events-none")}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 100 },
        }}
        // transition={{ delay: 1 }}
        initial={"visible"}
        animate={isLoading ? "visible" : "hidden"}>
        <Spinner size="md" />
      </motion.div>

      {!isLoading && children}
    </>
  );
};
