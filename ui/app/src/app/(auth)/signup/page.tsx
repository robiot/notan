"use client";

import Link from "next/link";

import { AuthTitle, TitleWrapper } from "../_components/Titles";
import { LoginForm } from "./_components/SignupForm";

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <TitleWrapper>
        <AuthTitle>Sign up</AuthTitle>
      </TitleWrapper>

      {/* <ContinueGoogleButton />

      <OrSeparator /> */}

      <LoginForm />

      <span className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-400">
          Log in
        </Link>
      </span>
    </div>
  );
};

export default SignupPage;
