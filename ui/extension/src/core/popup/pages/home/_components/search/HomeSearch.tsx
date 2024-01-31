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
      <div className="flex relative w-full">
        <DropdownMenuTrigger className="absolute h-full w-full -z-10" />
        <Input
          type="text"
          autoComplete="off"
          inputSize="small"
          placeholder="Search notes, use * to show all"
          className="w-full focus-visible:ring-0"
          onFocus={() => {
            console.log("called");
            setDropdownOpen(true);
            form.setFocus("search");
            document.body.style.pointerEvents = "";
          }}
          onBlur={() => {
            setDropdownOpen(false);
          }}
          {...form.register("search")}
        />
      </div>
      <DropdownMenuContent
        onInteractOutside={() => {
          //   setDropdownOpen(false);
          console.log("close buddy");
        }}>
        <DropdownMenuLabel>你来了</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
