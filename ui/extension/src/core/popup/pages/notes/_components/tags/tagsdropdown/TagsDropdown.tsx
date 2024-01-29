import { DropdownMenuSeparator } from "@notan/components/ui/dropdown-menu";
import { Spinner } from "@notan/components/ui/spinner";
import { FC } from "react";

import { useTags } from "@/core/popup/hooks/tags/useTags";

import { NoteUseForm } from "../../NoteView";
import { AddTagButton } from "../addtag/AddTagButton";
import { DropdownTagItem } from "./DropdownTagItem";

export const TagsDropdown: FC<{ form: NoteUseForm }> = ({ form }) => {
  const tags = useTags();

  if (tags.isLoading)
    return (
      <div className="h-10 w-full flex items-center justify-center">
        <Spinner size="sm" />
      </div>
    );

  return (
    <>
      {tags.data.map((tag) => (
        <DropdownTagItem key={`tag_${tag.id}`} form={form} tag={tag} refetch={() => tags.refetch()} />
      ))}

      {tags.data.length > 0 && <DropdownMenuSeparator />}

      <AddTagButton
        refetch={() => {
          tags.refetch();
        }}
      />
    </>
  );
};
