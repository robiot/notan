import { Button } from "@popup/components/ui/button";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Note } from "@/core/popup/hooks/notes/useNotes";
import { faviconFromUrl } from "@/core/popup/lib/favicon";
import { cn } from "@/core/popup/lib/utils";

export const NotePreview: FC<{ note: Note }> = ({ note }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      title={note.url}
      className={cn("flex justify-start items-start font-normal gap-3 text-start p-2 bg-card h-fit")}
      asChild>
      <Link
        to={note.url}
        onClick={(event) => {
          event.preventDefault();

          navigate(`/notes/view/${note.id}`);
        }}>
        <div>
          <img src={faviconFromUrl(note.url)} alt="" className="min-w-[1.5rem] w-6 h-6 rounded" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="truncate flex-1 w-72">{note.title}</span>
          <span className="text-sm text-card-foreground/70 truncate flex-1 w-72">{note.note}</span>
        </div>
      </Link>
    </Button>
  );
};
