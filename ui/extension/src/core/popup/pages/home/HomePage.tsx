import { Container } from "@popup/components/app/Container";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { useAuth } from "@popup/hooks/persist/useAuth";
import { Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Input } from "../../components/ui/input";

export const HomePage = () => {
  const auth = useAuth();

  return (
    <>
      <Topbar>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile">
            <User />
          </Link>
        </Button>
        <Input inputSize="small" placeholder="Search notes by domain/content" className="w-full" />
        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile">
            <Plus />
          </Link>
        </Button>
      </Topbar>
      <Container>
        <div className="flex flex-col gap-2">
          <span className="text-sm">Notes on your current page</span>
          <div className="bg-card rounded p-4 text-base">Notes - Figma</div>
        </div>

        <Button onClick={() => auth.logout()} className="mt-5">
          Log out
        </Button>
      </Container>
    </>
  );
};
