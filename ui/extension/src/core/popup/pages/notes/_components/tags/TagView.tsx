import { Skeleton } from "@notan/components/ui/Skeleton";
import { FC } from "react";
import { ReactNode } from "react";

import { useTagByID } from "@/core/popup/hooks/tags/useTagByID";
import { Tag } from "@/core/popup/hooks/tags/useTags";
import { cn } from "@/core/popup/lib/utils";

export type Color = [string, { style: string; name: string }];
export const colors = {
  purple: { style: "bg-purple-700 text-white", name: "Purple" },
  green: { style: "bg-green-700 text-white", name: "Green" },
  blue: { style: "bg-blue-700 text-white", name: "Blue" },
  orange: { style: "bg-yellow-700 text-white", name: "Orange" },
  red: { style: "bg-red-500 text-white", name: "Red" },
  gray: { style: "bg-accent text-white", name: "Gray" },
};

export const TagView: FC<{ children?: ReactNode; tag: Tag }> = ({ children, tag }) => {
  if (tag == undefined)
    return (
      <div className="flex items-center justify-center">
        Failure
        {children}
      </div>
    );

  return (
    <div
      className={cn(
        "px-1 py-[0.1rem] rounded text-sm flex gap-1 items-center whitespace-nowrap",
        colors[tag.color].style,
      )}>
      {tag.name}
      {children}
    </div>
  );
};

export const TagViewOne: FC<{ id: string; children?: ReactNode }> = ({ id, children }) => {
  const tag = useTagByID(id);

  if (tag.isLoading) return <Skeleton className="h-6 w-12" />;

  return <TagView tag={tag.data}>{children}</TagView>;
};
