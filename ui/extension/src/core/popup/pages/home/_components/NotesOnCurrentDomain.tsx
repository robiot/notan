import { useOtherNotesForCurrentDomain } from "@/core/popup/hooks/notes/useNotesForCurrentDomain";

import { NotePreview } from "./NotePreview";

export const NotesOnCurrentDomain = () => {
  const notes = useOtherNotesForCurrentDomain();

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
