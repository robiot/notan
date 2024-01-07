"use client";

import { FC, ReactNode } from "react";

import { AuthContext } from "@/components/context/AuthContext";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return <AuthContext type="auth">{children}</AuthContext>;
};

export default AuthLayout;
