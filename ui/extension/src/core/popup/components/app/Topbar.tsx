import { FC, ReactNode } from "react";

export const Topbar: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="bg-secondary w-full h-12 min-h-[3rem] flex items-center px-1 gap-1 border-b border-b-background">
      {children}
    </div>
  );
};
