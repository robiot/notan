import { Container } from "@popup/components/app/Container";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { useAuth } from "@popup/hooks/persist/useAuth";

export const HomePage = () => {
  const auth = useAuth();

  return (
    <>
      <Topbar />
      <Container>
        <Button onClick={() => auth.logout()}>Log out</Button>
      </Container>
    </>
  );
};
