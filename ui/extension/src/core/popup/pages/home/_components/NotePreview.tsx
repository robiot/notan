import { Button } from "@notan/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@notan/components/ui/context-menu";
import { Hand, Link as LinkIcon } from "lucide-react";
import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Note } from "@/core/popup/hooks/notes/useNotes";
import { faviconFromUrl } from "@/core/popup/lib/favicon";
import { calculateTimeAgo, cn } from "@/core/popup/lib/utils";

import { TagViewOne } from "../../notes/_components/tags/TagView";

export const NotePreview: FC<{ note: Note }> = ({ note }) => {
  const navigate = useNavigate();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Button
          variant="ghost"
          title={note.url}
          className={cn("flex justify-start items-start font-normal gap-3 text-start p-2 bg-card h-fit")}
          asChild>
          <Link
            to={note.url ?? ""}
            onClick={(event) => {
              event.preventDefault();

              navigate(`/notes/view/${note.id}`);
            }}>
            <div>
              {note.url ? (
                <img src={faviconFromUrl(note.url)} alt="" className="min-w-[1.5rem] w-6 h-6 rounded" />
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="truncate flex-1 w-72">{note.title}</span>
              <span className="text-sm text-card-foreground/70 truncate flex-1 w-72">{note.note}</span>
              {note.tags.length > 0 && (
                <div className="flex h-fit gap-2 w-full max-w-full overflow-x-auto transparent-scroll py-2">
                  {note.tags?.map((tag) => (
                    <TagViewOne key={`tag_note_${tag}`} id={tag}></TagViewOne>
                  ))}
                </div>
              )}
            </div>
          </Link>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {note.url && (
          <>
            <ContextMenuItem asChild>
              <Link to={note.url} target="_blank" className="flex items-center gap-2 w-44">
                Open link
                <LinkIcon className="ml-auto h-4 w-4" />
              </Link>
            </ContextMenuItem>
            <ContextMenuLabel className="text-xs font-normal flex gap-3 items-center">
              <Hand className="h-3 w-3" />
              <span className="font-normal">or drag to open</span>
            </ContextMenuLabel>
            <ContextMenuSeparator />
          </>
        )}

        <ContextMenuLabel className="font-normal">
          Created {calculateTimeAgo(new Date(note.created_at))}
        </ContextMenuLabel>
      </ContextMenuContent>
    </ContextMenu>
  );
};
