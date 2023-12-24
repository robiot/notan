import { Button } from "@notan/components/ui/button";
import { FC, ReactNode } from "react";

import { Price } from "@/hooks/billing/usePrices";
import { cn } from "@/lib/utils";

export const SubscriptionCard: FC<{
  price?: Price;
  title?: string;
  perks: {
    icon: ReactNode;
    text: string;
  }[];
  gradient?: "blue" | "purple";
}> = ({ price, gradient, title, perks }) => {
  if (!price) return null;

  return (
    <div
      className={cn(
        "flex flex-col p-10 rounded-2xl",
        gradient == "blue" && "bg-blue-gradient",
        gradient == "purple" && "bg-purple-blue-gradient"
      )}
    >
      <span className="text-3xl font-semibold">{title}</span>
      <span className="text-lg font-bold">{price.price / 100}€/month</span>

      <p className="text-md text-foreground/90 mt-5">
        {perks.map((perk) => (
          <div className="flex gap-2 items-center mt-3">
            {perk.icon}
            <span>{perk.text}</span>
          </div>
        ))}
      </p>

      <Button
        variant="inverted"
        className="mt-14"
        onClick={() => {
          alert("Not implemented yet. Please check by later.");
        }}
      >
        Subscribe
      </Button>
    </div>
  );
};
