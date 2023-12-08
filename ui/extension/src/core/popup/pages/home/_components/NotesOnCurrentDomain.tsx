import { FC } from "react";

import { Note } from "@/core/popup/hooks/notes/useNotes";

import { NotePreview } from "./NotePreview";

export const NotesOnCurrentDomain: FC<{ notes?: Note[]; currentTab: string }> = ({ notes, currentTab }) => {
  if (!notes || notes.length === 0) return null;

  return (
    <>
      <div className="flex justify-between text-sm py-1 mt-3">
        <span>
          Other notes on <b>{new URL(currentTab).hostname}</b>
        </span>
        {<span>{notes.length}</span>}
      </div>
      {notes
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((note) => (
          <NotePreview key={note.id} note={note} />
        ))}
    </>
  );
};
