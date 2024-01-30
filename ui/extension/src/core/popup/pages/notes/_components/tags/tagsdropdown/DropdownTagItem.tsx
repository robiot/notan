import { Button } from "@notan/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@notan/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { FC } from "react";

import { useTagByID } from "@/core/popup/hooks/tags/useTagByID";
import { Tag } from "@/core/popup/hooks/tags/useTags";

import { NoteUseForm } from "../../NoteView";
import { TagDeleteButton } from "../morebuttons/DeleteButton";
import { colors, TagView } from "../TagView";
import { ColorItem } from "./ColorItem";

export const DropdownTagItem: FC<{ form: NoteUseForm; tag: Tag; refetch: () => Promise<void> }> = ({
  form,
  tag,
  refetch,
}) => {
  const tagCustomData = useTagByID(tag.id);

  return (
    <DropdownMenuItem
      key={`tag_${tag.id}`}
      className="flex gap-3 justify-between cursor-pointer focus:bg-accent/40"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("called");

        // only add if not already added
        if (form.getValues("tags").includes(tag.id)) return;

        form.setValue("tags", [...form.getValues("tags"), tag.id], {
          shouldDirty: true,
        });
      }}>
      <TagView tag={tag} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="min-w-[1.5rem] w-6 h-6"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
            }}>
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <TagDeleteButton
            tag={tag}
            refetch={() => {
              refetch();
              form.setValue(
                "tags",
                form.getValues("tags").filter((t) => t !== tag.id),
              );
            }}
          />
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Color</DropdownMenuLabel>
            {Object.entries(colors).map((color) => (
              <ColorItem
                color={color}
                tag={tag}
                refetch={async () => {
                  await Promise.all([refetch(), tagCustomData.refetch()]);
                }}
              />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </DropdownMenuItem>
  );
};
