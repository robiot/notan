import { FC, ReactNode } from "react";

export const TitleWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col items-center w-full gap-4">{children}</div>
  );
};

export const AuthTitle: FC<{ children: ReactNode }> = ({ children }) => {
  return <span className="font-bold text-3xl">{children}</span>;
};

export const AuthSubtitle: FC<{ children: ReactNode }> = ({ children }) => {
  return <span className="text-foreground/80">{children}</span>;
};
