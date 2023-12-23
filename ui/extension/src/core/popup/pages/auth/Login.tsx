import { Separator } from "@popup/components/ui/separator";
import { Link } from "react-router-dom";

import Logo from "@/assets/img/notan.svg";
import { Container } from "@/core/popup/components/app/Container";

import { Button } from "../../components/ui/button";
import { createAppUrl } from "../../lib/urlUtils";

export const LoginPage = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex flex-col items-center w-full">
          <img src={Logo} alt="logo" className="h-10 mb-8" />

          <Button className="mt-4 w-full" asChild>
            <Link to={createAppUrl("/login")} target="_blank">
              Log in
            </Link>
          </Button>
        </div>

        <Separator orientation="horizontal" />
        <div className="flex flex-col items-center w-full">
          <span className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to={createAppUrl("/signup")} target="_blank" relative="path" className="text-blue-400">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </Container>
  );
};
