import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { Plus, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

import { Input } from "../../components/ui/input";
import { useCurrentTabInfo } from "../../hooks/generic/useCurrentTabInfo";
import { useOtherNotesForCurrentDomain } from "../../hooks/notes/useNotesForCurrentDomain";
import { useNotesForCurrentPage } from "../../hooks/notes/useNotesForCurrentPage";
import { NotesForSearch } from "./_components/NotesForSearch";
import { NotesOnCurrentDomain } from "./_components/NotesOnCurrentDomain";
import { NotesOnCurrentPage } from "./_components/NotesOnCurrentPage";
export const HomePage = () => {
  const notes = useNotesForCurrentPage();
  const notesDomain = useOtherNotesForCurrentDomain();
  const currentTab = useCurrentTabInfo();
  const form = useForm<{ search: string }>();

  const [search] = useDebounce(form.watch("search"), 300);

  // todo add loader here
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
      {/* <Container> */}
      <div className="flex flex-col overflow-auto gap-2 p-2 h-full max-h-full">
        {search && search.length >= 3 ? (
          <NotesForSearch search={search} />
        ) : (
          <>
            {notes.data?.length == undefined || notes.data?.length == 0 ? (
              <div className="flex items-center mt-2 gap-4 flex-col">
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

            {currentTab.data?.url && notesDomain.data?.length !== undefined && notesDomain.data?.length > 0 && (
              <div className="flex justify-between text-sm py-1 mt-3">
                <span>
                  Other notes on <b>{new URL(currentTab.data.url).hostname}</b>
                </span>
                {notesDomain.data?.length !== undefined && <span>{notesDomain.data?.length}</span>}
              </div>
            )}

            <NotesOnCurrentDomain />
          </>
        )}
      </div>
      {/* </Container> */}
    </>
  );
};
