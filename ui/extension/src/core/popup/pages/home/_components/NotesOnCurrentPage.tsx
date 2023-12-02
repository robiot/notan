import { useNotesForCurrentPage } from "@/core/popup/hooks/notes/useNotesForCurrentPage";

import { NotePreview } from "./NotePreview";

export const NotesOnCurrentPage = () => {
  const notes = useNotesForCurrentPage();

  return (
    <>
      {notes.data?.map((note) => (
        <NotePreview note={note} key={note.id} />
      ))}
    </>
  );
};
