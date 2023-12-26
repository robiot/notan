import { Button } from "@notan/components/ui/button";
import { DialogHeader, DialogTitle } from "@notan/components/ui/dialog";
import { FC, useEffect } from "react";

import { getPriceByLookupKey } from "@/hooks/billing/usePriceByLookupKey";
import { Price, usePrices } from "@/hooks/billing/usePrices";
import { cn } from "@/lib/utils";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { AlternativeT } from "../BuyFlowDialog";
import { BuyFlowFooterNotice } from "../BuyFlowFooter";

const Alternative: FC<{
  price?: Price;
  alternative: AlternativeT;
  onClick?: () => void;
}> = ({ price, alternative, onClick }) => {
  const buyFlow = useBuyFlow();

  const selected = price?.price_id == buyFlow.flowState.price_id;

  if (!price) return null;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "flex justify-between text-base font-normal h-14",
        selected && "border-primary border-4"
      )}
    >
      <span>
        {alternative.title}
        {alternative.save_percentage && (
          <span className="bg-green-600 text-sm ml-2 rounded px-1 py-[2px] font-bold">
            Save {alternative.save_percentage}%
          </span>
        )}
      </span>
      <span className="font-medium">
        {price.price / 100}€/{alternative.period}
      </span>
    </Button>
  );
};

export const BuyFlowPlanSelect: FC<{
  alternatives: AlternativeT[];
}> = ({ alternatives }) => {
  const prices = usePrices();
  const buyFlow = useBuyFlow();

  const setSubscriptionPlan = (alternative: AlternativeT) => {
    buyFlow.setFlowState({
      ...buyFlow.flowState,
      price_id: getPriceByLookupKey(alternative.key, prices.data)?.price_id,
      product_id: getPriceByLookupKey(alternative.key, prices.data)
        ?.product_id!,
      product_info: {
        ...buyFlow.flowState.product_info,
        type: "subscription",
        subscription_period: {
          period: alternative.period,
          title: alternative.title,
        },
      },
    });
  };

  useEffect(() => {
    setSubscriptionPlan(alternatives[1]);
  }, []);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">
          {buyFlow.flowState.title}
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2">
        {alternatives?.map((alternative) => (
          <Alternative
            key={`sub_alternative_${alternative.key}`}
            price={getPriceByLookupKey(alternative.key, prices.data)}
            alternative={alternative}
            onClick={() => {
              setSubscriptionPlan(alternative);
            }}
          />
        ))}
      </div>

      <Button
        className="my-2"
        onClick={() => {
          buyFlow.setPage("payment");
        }}
      >
        Select plan
      </Button>

      <BuyFlowFooterNotice />
    </>
  );
};
