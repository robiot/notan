"use client";

import { Button } from "@notan/components/ui/button";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

export const ContinueGoogleButton = () => {
  const auth = useAuth();

  const loginAuth = useMutation({
    mutationKey: ["loginAuth"],
    mutationFn: async (code: string) => {
      const response = await api
        .post<ApiResponse<{ token: string }>>("/auth/oauth/google", {
          google_auth_code: code,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "unauthorized")) {
            toast({
              title: "Unauthorized",
              variant: "destructive",
              description: "The login is incorrect",
            });
          }
        });

      if (!response) return;

      console.log(response.data);
      auth.login(response.data.data.token);
    },
  });

  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
    redirect_uri: window.location.origin,
    onSuccess: async (googleUser) => {
      const { code } = googleUser;

      await loginAuth.mutateAsync(code);
    },
    onError: () => {
      toast({
        title: "Google OAuth Error",
        description: "There was an error when signing in with google.",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      className="w-full font-normal gap-4 mt-4"
      variant="secondary"
      onClick={login}
    >
      <Image src="/icons/google.png" alt="google" width={24} height={24} />
      Continue with Google
    </Button>
  );
};
