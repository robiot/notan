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
    <h1 className="text-3xl sm:text-[2.8rem] !leading-tight font-extrabold">
      {children}
    </h1>
  );
};

export const HeroSubHeading: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="text-lg px-5 !leading-relaxed font-normal">{children}</div>
  );
};
