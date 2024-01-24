import { Button } from "@notan/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@notan/components/ui/dropdown-menu";
import { Plus } from "lucide-react";

import { TagsDropdown } from "./TagsDropdown";
import { TagView } from "./TagView";

export const Tags = () => {
  return (
    <DropdownMenu>
      <div className="mt-2 flex gap-2 w-full max-w-full overflow-auto justify-center">
        {/* <span className="text-sm font-normal whitespace-nowrap text-foreground/80">No tags</span> */}

        <TagView />
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center rounded">
            <Plus className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
      </div>
      <TagsDropdown />
    </DropdownMenu>
  );
};
