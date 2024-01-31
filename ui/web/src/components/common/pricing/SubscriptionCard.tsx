import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const SubscriptionCard: FC<{
  title: string;
  price: {
    amount: number;
    period: string;
  };
  popular?: boolean;
  perks: {
    icon: ReactNode;
    text: string;
    tooltip?: string;
  }[];
  children?: ReactNode;
}> = ({ title, price, perks, popular, children }) => {
  return (
    <div
      className={cn(
        "text-left flex flex-col p-8 rounded-2xl bg-card border relative",
        popular ? "border-primary border-2" : "border-border/90"
      )}
    >
      {popular && (
        <div className="text-sm bg-primary rounded px-1 absolute -top-2 left-1/2 -translate-x-1/2">
          POPULAR
        </div>
      )}
      <div className="text-xl font-semibold mb-3">{title}</div>
      <div className="">
        <span className="text-4xl font-bold">${price.amount}</span>

        <span className="ml-2">/ {price.period}</span>
      </div>

      <div className="text-md text-foreground/90 mt-2">
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

      <div className="mt-10 flex w-full">{children}</div>
    </div>
  );
};
