import { FC, ReactNode } from "react";

import { Navbar } from "../assembled/navbar/Navbar";

export const Hero: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col items-center h-[45rem] w-full bg-blue-gradient text-background">
      <Navbar />

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
