import { ChevronRight } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";

import { Container } from "@/core/popup/components/app/Container";
import { Topbar } from "@/core/popup/components/app/Topbar";
import { Button } from "@/core/popup/components/ui/button";
import { useAuth } from "@/core/popup/hooks/persist/useAuth";
import { useUser } from "@/core/popup/hooks/user/useUser";

const FieldButton: FC<{ title: string; value?: string; path: string }> = ({ title, value, path }) => {
  return (
    <Button variant="ghost" className="h-fit px-4 py-3 w-full bg-secondary justify-between" size="icon" asChild>
      <Link to={path}>
        <div className="font-normal flex flex-col gap-[0.1rem]">
          <span className="text-sm text-secondary-foreground/70">{title}</span>
          <span className="text-sm">{value}</span>
        </div>
        <ChevronRight />
      </Link>
    </Button>
  );
};

export const ProfileOverviewPage = () => {
  const auth = useAuth();
  const user = useUser();

  if (user.isLoading) return <span>Loading</span>;

  return (
    <>
      <Topbar>
        <div className="flex flex-1 justify-between">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/">BACK</Link>
          </Button>
        </div>
      </Topbar>
      <Container>
        <div className="flex flex-col gap-2">
          <FieldButton title="Username" value={user.data.username} path="/profile/username" />
          <FieldButton title="Email" value={user.data.email} path="/profile/email" />
          <FieldButton title="Password" path="/profile/password" />

          <Button variant="ghost" className="mt-4" onClick={() => auth.logout()}>
            Log out
          </Button>
        </div>
      </Container>
    </>
  );
};
