import { DropdownMenuContent } from "@notan/components/ui/dropdown-menu";
import { FC } from "react";

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
