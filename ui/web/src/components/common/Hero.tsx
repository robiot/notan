import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const Hero: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center w-full text-background",
        className
      )}
    >
      {children}
    </div>
  );
};

export const HeroHeading: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <h1 className="text-4xl sm:text-5xl leading-tight font-bold">{children}</h1>
  );
};

export const HeroSubHeading: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="text-lg sm:text-xl font-normal pt-8">{children}</div>;
};
