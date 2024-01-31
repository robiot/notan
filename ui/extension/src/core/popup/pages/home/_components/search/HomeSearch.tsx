import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@notan/components/ui/dropdown-menu";
import { Input } from "@notan/components/ui/input";
import { FC } from "react";
import { useState } from "react";

import { HomeForm } from "../../HomePage";

export const HomeSearch: FC<{ form: HomeForm }> = ({ form }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={() => {
        document.body.style.pointerEvents = "";
      }}>
      <div className="flex relative flex-1">
        <DropdownMenuTrigger className="absolute h-full w-full -z-10" />
        <Input
          type="text"
          autoComplete="off"
          inputSize="small"
          placeholder="Search notes by title, content, or tag"
          className="w-full focus-visible:ring-0"
          onClick={() => {
            console.log("called");
            setDropdownOpen(true);
            form.setFocus("search");
            document.body.style.pointerEvents = "";
          }}
          onBlur={() => {
            form.setFocus("search");
          }}
          {...form.register("search")}
        />
      </div>

      {/* ehhh this needs to be thought about */}
      {/* save in search like, view:all, or just hidden page?!?*/}
      <DropdownMenuContent
        tabIndex={undefined}
        className="w-48 mt-0"
        onInteractOutside={() => {
          setDropdownOpen(false);
          console.log("close buddy");
        }}>
        <DropdownMenuLabel>Select a view</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>All notes</DropdownMenuItem>
        <DropdownMenuItem>Tag</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
