import { Spinner } from "@notan/components/ui/spinner";
import { FC } from "react";
import { Link } from "react-router-dom";

import { useCurrentTabInfo } from "@/core/popup/hooks/generic/useCurrentTabInfo";
import { useNotes } from "@/core/popup/hooks/notes/useNotes";
import { useOtherNotesForCurrentDomain } from "@/core/popup/hooks/notes/useNotesForCurrentDomain";
import { useNotesForCurrentPage } from "@/core/popup/hooks/notes/useNotesForCurrentPage";
import { useNotesForSearch } from "@/core/popup/hooks/notes/useNotesForSearch";

import { NotesForSearch } from "./NotesForSearch";
import { NotesOnCurrentDomain } from "./NotesOnCurrentDomain";
import { NotesOnCurrentPage } from "./NotesOnCurrentPage";

export const HomeNotes: FC<{ search: string }> = ({ search }) => {
  const notes = useNotes();
  const currentTab = useCurrentTabInfo();

  const notesCurrentPage = useNotesForCurrentPage(notes);
  const notesDomain = useOtherNotesForCurrentDomain(notes);
  const notesSearch = useNotesForSearch(notes, search);

  if (
    notes.isFetching ||
    notesCurrentPage.isFetching ||
    notesDomain.isFetching ||
    currentTab.isFetching ||
    notesSearch.isFetching
  ) {
    return (
      <div className="flex mt-5 justify-center items-center">
        <Spinner size="sm" />
      </div>
    );
  }

  if (search) return <NotesForSearch notes={notesSearch.data} />;

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
