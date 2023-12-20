"use client";

import { Separator } from "@notan/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/Container";

import { LoginForm } from "./_components/LoginForm";

const LoginPage = () => {
  return (
    <Container size="xs" className="flex">
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex flex-col items-center w-full gap-9">
          <Image src={"/notan.svg"} alt="logo" width={160} height={60} />

          <LoginForm />
        </div>

        <Separator orientation="horizontal" />

        <div className="flex flex-col items-center w-full">
          <span className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-400">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;
