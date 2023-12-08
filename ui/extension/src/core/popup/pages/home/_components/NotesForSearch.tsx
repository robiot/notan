import { FC } from "react";

import { Note } from "@/core/popup/hooks/notes/useNotes";

import { NotePreview } from "./NotePreview";

export const NotesForSearch: FC<{ notes?: Note[] }> = ({ notes }) => {
  return (
    <>
      {notes?.map((note) => (
        <NotePreview key={note.id} note={note} />
      ))}

      {!notes ||
        (notes.length === 0 && (
          <div className="flex-1 flex justify-center items-center">
            <span className="text-center text-base">No notes found for this search 😒.</span>
          </div>
        ))}
    </>
  );
};
