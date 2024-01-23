import { Button } from "@notan/components/ui/button";
import { CheckCircle } from "lucide-react";
import { FC, ReactNode } from "react";

import { useActiveSubscription } from "@/hooks/billing/useActiveSubscription";
import { Price } from "@/hooks/billing/usePrices";
import { cn } from "@/lib/utils";

import { AlreadySubscribingDialog } from "./already_subscribing/AlreadySubscribingDialog";
import { AlternativeT, BuyFlowDialog } from "./buy_flow/BuyFlowDialog";

export const SubscriptionCard: FC<{
  price?: Price;
  price_annually?: Price;
  title?: string;
  alternatives: AlternativeT[];
  perks: {
    icon: ReactNode;
    text: string;
    tooltip?: string;
  }[];
  gradient?: "blue" | "purple";
}> = ({ price, alternatives, gradient, title, perks, price_annually }) => {
  const subscriptions = useActiveSubscription();

  const isSubscribed =
    subscriptions.data?.subscription?.product?.id == price?.product_id;

  const subscribeButton = (
    <Button className="mt-8 flex gap-5 h-11" disabled={isSubscribed}>
      {isSubscribed ? (
        <>
          <CheckCircle className="w-5 h-5" />
          Currently subscribing
        </>
      ) : (
        <>Subscribe</>
      )}
    </Button>
  );

  if (!price || !price_annually) return null;

  return (
    <div
      className={cn(
        "flex flex-col p-8 rounded-2xl bg-card",
        gradient == "blue" && "bg-blue-gradient",
        gradient == "purple" && "bg-purple-blue-gradient"
      )}
    >
      <div className="text-xl font-semibold mb-3">{title}</div>
      <div className="text-md font-medium text-card-foreground/80">
        ${price_annually.price / 100 / 12} / month billed annually
      </div>
      <div className="text-xs font-medium text-card-foreground/80">
        ${price.price / 100} / month billed monthly
      </div>

      <div className="text-sm text-foreground/90 mt-5 flex flex-col gap-2">
        {perks.map((perk) => (
          <div className="flex gap-2 items-center" key={`perk_${perk.text}`}>
            {perk.icon}
            <span>{perk.text}</span>
          </div>
        ))}
      </div>

      {subscriptions.data?.notFound ? (
        <BuyFlowDialog alternatives={alternatives} title={title}>
          {subscribeButton}
        </BuyFlowDialog>
      ) : (
        <AlreadySubscribingDialog>{subscribeButton}</AlreadySubscribingDialog>
      )}
    </div>
  );
};
