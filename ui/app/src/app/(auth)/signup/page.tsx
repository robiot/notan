"use client";

import { Separator } from "@notan/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/Container";

import { LoginForm } from "./_components/SignupForm";

const SignupPage = () => {
  return (
    <Container size="xs" className="flex">
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex flex-col items-center w-full">
          <Image src={"/notan.svg"} alt="logo" width={160} height={60} />

          <span className="text-2xl font-bold mt-5">Sign up</span>
          <LoginForm />
        </div>

        <Separator orientation="horizontal" />

        <div className="flex flex-col items-center w-full">
          <span className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400">
              Log in
            </Link>
          </span>
        </div>
      </div>
    </Container>
  );
};

export default SignupPage;
