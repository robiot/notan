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

      {/* <Button className="w-full font-normal gap-4 mt-4" variant="secondary">
        <Image src="/icons/google.png" alt="google" width={24} height={24} />
        Continue with Google
      </Button> */}

      {/* <div className="flex gap-5 w-full items-center">
        <Separator orientation="horizontal" className="flex-1" />
        <span className="text-sm">OR</span>
        <Separator orientation="horizontal" className="flex-1" />
      </div> */}

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
