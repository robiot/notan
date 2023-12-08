import { FC } from "react";
import { Link } from "react-router-dom";

import { Spinner } from "@/core/popup/components/ui/spinner";
import { useCurrentTabInfo } from "@/core/popup/hooks/generic/useCurrentTabInfo";
import { useNotes } from "@/core/popup/hooks/notes/useNotes";
import { useOtherNotesForCurrentDomain } from "@/core/popup/hooks/notes/useNotesForCurrentDomain";
import { useNotesForCurrentPage } from "@/core/popup/hooks/notes/useNotesForCurrentPage";

import { NotesForSearch } from "./NotesForSearch";
import { NotesOnCurrentDomain } from "./NotesOnCurrentDomain";
import { NotesOnCurrentPage } from "./NotesOnCurrentPage";

export const HomeNotes: FC<{ search: string }> = ({ search }) => {
  const notes = useNotes();
  const notesCurrentPage = useNotesForCurrentPage();
  const notesDomain = useOtherNotesForCurrentDomain();
  const currentTab = useCurrentTabInfo();

  if (notes.isFetching || notesCurrentPage.isFetching || notesDomain.isFetching || currentTab.isFetching) {
    return (
      <div className="flex mt-5 justify-center items-center">
        <Spinner size="sm" />
      </div>
    );
  }

  if (search && search.length >= 3) return <NotesForSearch search={search} />;

  return (
    <>
      {(!notesCurrentPage.data || notesCurrentPage.data.length === 0) && (
        <div className="flex items-center mt-2 gap-4 flex-col">
          <span className="text-center text-base">You don't have any notes for this page 😒.</span>
          <Link to={"/notes/create"} className="text-center text-sm text-blue-500">
            Create one
          </Link>
        </div>
      )}

      <NotesOnCurrentPage notes={notesCurrentPage.data} />

      <NotesOnCurrentDomain notes={notesDomain?.data} currentTab={currentTab.data.url} />
    </>
  );
};
