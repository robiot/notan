import { FC } from "react";

import { DropdownMenuContent } from "@/core/popup/components/ui/dropdown-menu";

import { DeleteButton } from "./morebuttons/DeleteButton";

export const MoreDropdown: FC = () => {
  return (
    <>
      <DropdownMenuContent className="mt-1">
        <DeleteButton />
      </DropdownMenuContent>
    </>
  );
};
