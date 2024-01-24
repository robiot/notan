import { Button } from "@notan/components/ui/button";
import { Plus } from "lucide-react";

export const Tags = () => {
  return (
    <div className="flex items-center gap-5">
      <span>No tags</span>
      <Button variant="secondary" size="icon" className="h-6 w-6">
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  );
};
