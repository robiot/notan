"use client";

import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const auth = useAuth();
  const path = usePathname();

  useEffect(() => {
    if (auth.token) {
      router.push("/");
    }
  }, [auth, router, path]);

  return <>{children}</>;
};

export default AuthLayout;
