"use client";

import Link from "next/link";

import { AuthSubtitle, AuthTitle, TitleWrapper } from "../_components/Titles";
import { LoginForm } from "./_components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <TitleWrapper>
          <AuthTitle>Log in to your Account</AuthTitle>
          {/* <AuthSubtitle>Welcome back! Select a method to log in:</AuthSubtitle> */}
          <AuthSubtitle>Welcome back!</AuthSubtitle>
        </TitleWrapper>

        {/* <Button className="w-full font-normal gap-4 mt-4" variant="secondary">
          <Image src="/icons/google.png" alt="google" width={24} height={24} />
          Continue with Google
        </Button>

        <div className="flex gap-5 w-full items-center">
          <Separator orientation="horizontal" className="flex-1" />
          <span className="text-sm">OR</span>
          <Separator orientation="horizontal" className="flex-1" />
        </div> */}

        <LoginForm />

        {/* <Link href="/signup" className="text-sm text-blue-400">
          Forgot Password?
        </Link> */}
        <span className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-400">
            Sign up
          </Link>
        </span>
      </div>
    </>
  );
};

export default LoginPage;
