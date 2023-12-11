import { FC, ReactNode } from "react";

export const SectionHeading: FC<{ children: ReactNode }> = ({ children }) => {
  return <h2 className="font-bold text-4xl">{children}</h2>;
};
