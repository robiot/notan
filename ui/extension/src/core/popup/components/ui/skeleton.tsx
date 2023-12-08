import { cn } from "@popup/lib/utils";
import { HTMLAttributes } from "react";

function Skeleton({ className, ...properties }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} {...properties} />;
}

export { Skeleton };
