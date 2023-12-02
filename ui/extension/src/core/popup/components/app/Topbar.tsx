import { FC, ReactNode } from "react";

export const Topbar: FC<{ children?: ReactNode }> = ({ children }) => {
  return <div className="bg-secondary w-full h-12 flex items-center px-1 gap-1">{children}</div>;
};
