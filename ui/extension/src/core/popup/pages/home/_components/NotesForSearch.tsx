import { FC } from "react";

import { useNotesForSearch } from "@/core/popup/hooks/notes/useNotesForSearch";

import { NotePreview } from "./NotePreview";

export const NotesForSearch: FC<{ search: string }> = ({ search }) => {
  const notes = useNotesForSearch(search);

  return (
    <>
      {notes.data?.map((note) => (
        <NotePreview key={note.id} note={note} />
      ))}

      {!notes.data ||
        (notes.data.length === 0 && (
          <div className="flex-1 flex justify-center items-center">
            <span className="text-center text-base">No notes found for this search 😒.</span>
          </div>
        ))}
    </>
  );
};
