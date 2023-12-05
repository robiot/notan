import { useNotesForCurrentPage } from "@/core/popup/hooks/notes/useNotesForCurrentPage";

import { NotePreview } from "./NotePreview";

export const NotesOnCurrentPage = () => {
  const notes = useNotesForCurrentPage();

  return (
    <>
      {notes.data
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((note) => (
          <NotePreview key={note.id} note={note} />
        ))}
    </>
  );
};
