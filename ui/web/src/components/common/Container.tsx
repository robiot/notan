import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const Container: FC<{
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  size?: "xlarge" | "large" | "small";
}> = ({ children, className, noPadding, size = "large" }) => {
  return (
    <div className={cn("h-full flex w-full", !noPadding && "px-6")}>
      <div
        className={cn(
          "w-full mx-auto",
          size == "xlarge" && "max-w-6xl",
          size == "large" && "max-w-4xl",
          size == "small" && "max-w-md",

          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
