import { FC, ReactNode } from "react";

export const OptionItem: FC<{
  title: string;
  description: string;
  children: ReactNode;
}> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-col gap-2 mb-2 sm:mb-5">
        <span className="text-foreground font-medium">{title}</span>
        <p className="text-foreground/80 font-normal">{description}</p>
      </div>
      {children}
    </div>
  );
};
