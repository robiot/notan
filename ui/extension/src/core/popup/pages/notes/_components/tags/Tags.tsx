import { Button } from "@notan/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@notan/components/ui/dropdown-menu";
import { Plus, X } from "lucide-react";
import { FC } from "react";

import { NoteUseForm } from "../NoteView";
import { TagsDropdown } from "./tagsdropdown/TagsDropdown";
import { TagViewOne } from "./TagView";

const TagsContent: FC<{ form: NoteUseForm }> = ({ form }) => {
  const tagsArray = form.watch("tags");

  return (
    <>
      {tagsArray?.map((tag) => (
        <TagViewOne key={`tag_note_${tag}`} id={tag}>
          <button
            className="hover:text-foreground/80 h-full aspect-square focus-visible:outline-0 focus-visible:ring-0"
            onClick={() => {
              const tags = form.getValues("tags");

              form.setValue(
                "tags",
                tags.filter((t) => t !== tag),
                {
                  shouldDirty: true,
                },
              );
            }}>
            <X className="w-3 h-3" />
          </button>
        </TagViewOne>
      ))}
      {tagsArray.length === 0 && (
        <span className="text-sm font-normal whitespace-nowrap text-foreground/80">No tags</span>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="h-6 w-6 p-0 rounded focus-visible:ring-0">
            <Plus className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mt-1">
          <TagsDropdown form={form} />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const Tags: FC<{ form: NoteUseForm }> = ({ form }) => {
  return (
    <div className="mt-2 flex h-fit gap-2 w-full max-w-full overflow-x-auto transparent-scroll justify-center pb-2">
      <TagsContent form={form} />
    </div>
  );
};
