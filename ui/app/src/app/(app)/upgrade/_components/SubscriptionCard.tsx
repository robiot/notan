import { Button } from "@notan/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@notan/components/ui/popover";
import { CheckCircle } from "lucide-react";
import { FC, ReactNode } from "react";

import { useActiveSubscription } from "@/hooks/billing/useActiveSubscription";
import { Price } from "@/hooks/billing/usePrices";
import { cn } from "@/lib/utils";

import { AlreadySubscribingDialog } from "./already_subscribing/AlreadySubscribingDialog";
import { AlternativeT, BuyFlowDialog } from "./buy_flow/BuyFlowDialog";

export const SubscriptionCard: FC<{
  price?: Price;
  title?: string;
  alternatives: AlternativeT[];
  perks: {
    icon: ReactNode;
    text: string;
    tooltip?: string;
  }[];
  gradient?: "blue" | "purple";
}> = ({ price, alternatives, gradient, title, perks }) => {
  const subscriptions = useActiveSubscription();

  const isSubscribed =
    subscriptions.data?.subscription?.product?.id == price?.product_id;

  const subscribeButton = (
    <Button
      variant="inverted"
      className="mt-14 flex gap-5"
      disabled={isSubscribed}
    >
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

      <div className="text-md text-foreground/90 mt-5">
        {perks.map((perk) => (
          <div
            className="flex gap-2 items-center mt-3"
            key={`perk_${perk.text}`}
          >
            {perk.icon}
            <span>{perk.text}</span>
            {perk.tooltip && (
              <Popover>
                <PopoverTrigger>
                  <Button variant="ghost" className="p-0 h-fit w-5">
                    ?
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="text-sm">
                  {perk.tooltip}
                </PopoverContent>
              </Popover>
            )}
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
