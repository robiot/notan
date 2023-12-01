import { Separator } from "@popup/components/ui/separator";
import { Link } from "react-router-dom";

import Logo from "@/assets/img/logo.png";
import { Container } from "@/core/popup/components/app/Container";

import { LoginForm } from "./_components/SignupForm";

export const SignupPage = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex flex-col items-center w-full">
          <img src={Logo} alt="logo" />

          <span className="text-2xl font-bold mt-5">Sign up</span>
          <LoginForm />
        </div>

        <Separator orientation="horizontal" />

        <div className="flex flex-col items-center w-full">
          <span className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-400">
              Log in
            </Link>
          </span>
        </div>
      </div>
    </Container>
  );
};
