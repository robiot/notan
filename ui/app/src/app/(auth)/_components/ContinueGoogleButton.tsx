"use client";

import { Button } from "@notan/components/ui/button";
import { toast } from "@notan/components/ui/use-toast";
import { useGoogleLogin } from "@react-oauth/google";
import Image from "next/image";

export const ContinueGoogleButton = () => {
  const login = useGoogleLogin({
    flow: "auth-code",
    ux_mode: "popup",
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
