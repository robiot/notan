import { FC, ReactNode } from "react";

export const Container: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex flex-col p-2 flex-1 max-h-full">{children}</div>;
};
