import { Container } from "@popup/components/app/Container";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { Plus, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

import { Input } from "../../components/ui/input";
import { useNotesForCurrentPage } from "../../hooks/notes/useNotesForCurrentPage";
import { NotesForSearch } from "./_components/NotesForSearch";
import { NotesOnCurrentPage } from "./_components/NotesOnCurrentPage";
export const HomePage = () => {
  const notes = useNotesForCurrentPage();

  const form = useForm<{ search: string }>();

  const [search] = useDebounce(form.watch("search"), 300);

  return (
    <>
      <Topbar>
        <Button variant="ghost" size="icon" asChild>
          <Link to="/profile">
            <User />
          </Link>
        </Button>
        <Input
          inputSize="small"
          placeholder="Search notes by domain/content"
          className="w-full"
          {...form.register("search")}
        />
        <Button variant="ghost" size="icon" asChild>
          <Link to="/notes/create">
            <Plus />
          </Link>
        </Button>
      </Topbar>
      <Container>
        <div className="flex flex-col gap-2 flex-1">
          {search && search.length >= 3 ? (
            <NotesForSearch search={search} />
          ) : (
            <>
              {notes.data?.length == undefined || notes.data?.length == 0 ? (
                <div className="flex-1 flex items-center mt-2 gap-4 flex-col">
                  <span className="text-center text-base">You don't have any notes for this page 😒.</span>
                  <Link to={"/notes/create"} className="text-center text-sm text-blue-500">
                    Create one
                  </Link>
                </div>
              ) : (
                <div className="flex justify-between text-sm py-1">
                  <span>Notes on your current page</span>
                  {notes.data?.length !== undefined && <span>{notes.data?.length}</span>}
                </div>
              )}

              <NotesOnCurrentPage />
            </>
          )}
        </div>
      </Container>
    </>
  );
};
