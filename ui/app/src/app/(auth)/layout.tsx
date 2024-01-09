"use client";

import Image from "next/image";
import { FC, ReactNode } from "react";

import { Container } from "@/components/common/Container";
import { AuthContext } from "@/components/context/AuthContext";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthContext type="auth">
      <Container size="xs" className="flex-col flex">
        <div className="w-full flex justify-center py-6">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={341}
            height={102}
            className="h-11 w-auto mb-20"
          />
        </div>
        {children}
      </Container>
    </AuthContext>
  );
};

export default AuthLayout;
