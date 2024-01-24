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
import { MoreVertical, Plus } from "lucide-react";

import { TagDeleteButton } from "./morebuttons/DeleteButton";
import { TagView } from "./TagView";

export const TagsDropdown = () => {
  return (
    <DropdownMenuContent className="mt-1">
      <DropdownMenuItem
        className="flex gap-3 justify-between cursor-pointer focus:bg-accent/40"
        onClick={(event) => {
          event.preventDefault();
        }}>
        <TagView noX />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="min-w-[1.5rem] w-6 h-6">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <TagDeleteButton />
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Color</DropdownMenuLabel>
              <DropdownMenuItem className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-700" />
                Red
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-700" />
                Purple
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        className="flex gap-3 justify-between cursor-pointer"
        onClick={(event) => {
          event.preventDefault();
        }}>
        <div>Add tag</div>
        <Plus className="w-5 h-5" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
};
