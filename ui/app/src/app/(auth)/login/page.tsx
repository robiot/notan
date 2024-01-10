"use client";

import Link from "next/link";

import { AuthSubtitle, AuthTitle, TitleWrapper } from "../_components/Titles";
import { LoginForm } from "./_components/LoginForm";

const LoginPage = () => {
  return (
    <>
      <div className="flex flex-col gap-6">
        <TitleWrapper>
          <AuthTitle>Log in to your Account</AuthTitle>
          <AuthSubtitle>Welcome back! Select a method to log in:</AuthSubtitle>
        </TitleWrapper>

        <div className="flex flex-col w-full gap-6">
          {/* <ContinueGoogleButton />

          <OrSeparator /> */}

          <LoginForm />

          {/* <Link href="/signup" className="text-sm text-blue-400">
          Forgot Password?
        </Link> */}
        </div>
        <span className="text-sm text-center text-muted-foreground">
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
