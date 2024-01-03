import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const SubscriptionCard: FC<{
  title: string;
  price: string;
  perks: {
    icon: ReactNode;
    text: string;
    tooltip?: string;
  }[];
  gradient?: "blue" | "purple";
  children?: ReactNode;
}> = ({ title, price, perks, gradient, children }) => {
  return (
    <div
      className={cn(
        "text-left flex flex-col p-10 rounded-2xl",
        gradient == "blue" && "bg-blue-gradient",
        gradient == "purple" && "bg-purple-blue-gradient"
      )}
    >
      <span className="text-3xl font-semibold">{title}</span>
      <span className="text-lg font-bold">{price}</span>

      <div className="text-md text-foreground/90 mt-5">
        {perks.map((perk) => (
          <div
            className="flex gap-2 items-center mt-3"
            key={`perk_${perk.text}`}
          >
            {perk.icon}
            <span>{perk.text}</span>
          </div>
        ))}
      </div>

      <div className="mt-16 flex w-full">{children}</div>
    </div>
  );
};
