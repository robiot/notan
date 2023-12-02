import { Button } from "@popup/components/ui/button";
import { FC } from "react";

import { Note } from "@/core/popup/hooks/notes/useNotes";
import { faviconFromUrl } from "@/core/popup/lib/favicon";
import { cn } from "@/core/popup/lib/utils";

export const NotePreview: FC<{ note: Note }> = ({ note }) => {
  return (
    <Button
      variant="ghost"
      className={cn("flex justify-start items-start font-normal gap-3 text-start p-2 bg-card h-fit")}>
      <div className="">
        <img src={faviconFromUrl(note.url)} alt="" className="min-w-[1.5rem] w-6 h-6 rounded-full" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="">{note.title}</span>
        <span className="text-sm text-card-foreground/70 truncate flex-1 w-72">{note.note}</span>
      </div>
    </Button>
  );
};
