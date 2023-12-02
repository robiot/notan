import { Container } from "@popup/components/app/Container";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { Plus, User } from "lucide-react";
import { Link } from "react-router-dom";

import { Input } from "../../components/ui/input";
import { useNotesForCurrentPage } from "../../hooks/notes/useNotesForCurrentPage";
import { useAuth } from "../../hooks/persist/useAuth";
import { NotesOnCurrentPage } from "./_components/NotesOnCurrentPage";

export const HomePage = () => {
  const auth = useAuth();

  const notes = useNotesForCurrentPage();

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
          <Link to="/notes/create">
            <Plus />
          </Link>
        </Button>
      </Topbar>
      <Container>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm py-1">
            <span>Notes on your current page</span>
            {notes.data?.length !== undefined && <span>{notes.data?.length}</span>}
          </div>
          <NotesOnCurrentPage />
        </div>

        <Button variant="ghost" className="mt-4" onClick={() => auth.logout()}>
          Log out
        </Button>
      </Container>
    </>
  );
};
