import { Separator } from "@popup/components/ui/separator";
import { Link } from "react-router-dom";

import Logo from "@/assets/img/logo.png";
import { Container } from "@/core/popup/components/app/Container";

import { LoginForm } from "./_components/LoginForm";

export const LoginPage = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex flex-col items-center w-full">
          <img src={Logo} alt="logo" />

          <LoginForm />
        </div>

        <Separator orientation="horizontal" />

        <div className="flex flex-col items-center w-full">
          <span className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-blue-400">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </Container>
  );
};
