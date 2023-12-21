import { FC, ReactNode } from "react";

export const PageTitle: FC<{ children: ReactNode }> = ({ children }) => {
  return <h1 className="text-2xl font-bold my-9">{children}</h1>;
};
