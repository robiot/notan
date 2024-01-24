import { Button } from "@notan/components/ui/button";
import { DialogHeader, DialogTitle } from "@notan/components/ui/dialog";
import { Separator } from "@notan/components/ui/separator";
import { FC, useEffect } from "react";

import { BuyFlowFooterNotice } from "@/components/common/FlowFooter";
import { getPriceByPriceKey } from "@/hooks/billing/usePriceByPriceKey";
import { Price, usePrices } from "@/hooks/billing/usePrices";
import { cn } from "@/lib/utils";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { AlternativeT } from "../BuyFlowDialog";

const Alternative: FC<{
  price?: Price;
  alternative: AlternativeT;
  onClick?: () => void;
}> = ({ price, alternative, onClick }) => {
  const buyFlow = useBuyFlow();

  const selected = price?.price_key == buyFlow.flowState.price_key;

  if (!price) return null;

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={cn(
        "flex justify-between text-sm font-normal h-12",
        selected && "border-primary border-2"
      )}
    >
      <span className="text-sm">
        {alternative.title}
        {alternative.save_percentage && (
          <span className="bg-green-700 text-xs ml-2 rounded px-1 py-[2px] font-bold">
            Save {alternative.save_percentage}%
          </span>
        )}
      </span>
      {alternative.period == "month" && (
        <span className="font-bold">
          ${price.price / 100} / {alternative.period}
        </span>
      )}

      {alternative.period == "year" && (
        <div className="flex gap-4 h-full items-center">
          <span className="font-medium text-sm">
            ${price.price / 100} / {alternative.period}
          </span>
          <Separator orientation="vertical" />
          <span className="font-bold">${price.price / 100 / 12} / month</span>
        </div>
      )}
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
      price_key: getPriceByPriceKey(alternative.key, prices.data)?.price_key,
      product_id: getPriceByPriceKey(alternative.key, prices.data)?.product_id!,
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
      <div className="flex flex-col gap-3">
        {alternatives?.map((alternative) => (
          <Alternative
            key={`sub_alternative_${alternative.key}`}
            price={getPriceByPriceKey(alternative.key, prices.data)}
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
