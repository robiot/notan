import { Check } from "lucide-react";
import { FC } from "react";

export const CheckItem: FC<{
  children: string;
}> = ({ children }) => {
  return (
    <div className="flex justify-center md:justify-start items-center gap-3 w-52">
      <Check />
      <div className="text-sm">{children}</div>
    </div>
  );
};
