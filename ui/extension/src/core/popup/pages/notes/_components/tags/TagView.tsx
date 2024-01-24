import { X } from "lucide-react";
import { FC } from "react";

import { cn } from "@/core/popup/lib/utils";

const colors = {
  purple: "bg-purple-700 text-white",
  green: "bg-green-700 text-white",
  blue: "bg-blue-700 text-white",
  yellow: "bg-yellow-700 text-white",
  red: "bg-red-500 text-white",
  gray: "bg-accent text-white",
};

export const TagView: FC<{ noX?: boolean }> = ({ noX }) => {
  return (
    <div className={cn("px-1 py-[0.1rem] rounded text-sm flex gap-1 items-center", colors.gray)}>
      Todo
      {!noX && (
        <button className="hover:text-foreground/80 h-full aspect-square">
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
