import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@notan/components/ui/dialog";
import { FC, ReactNode } from "react";

import { FooterBackButton } from "@/components/common/FlowFooter";
import { usePriceByPriceKey } from "@/hooks/billing/usePriceByPriceKey";

import { useBuyFlow } from "../hooks/useBuyFlow";
import { BuyFlowAddCard } from "./add/BuyFlowAddCard";
import { BuyFlowPayment } from "./payment/BuyFlowPayment";
import { BuyFlowPlanSelect } from "./planselect/BuyFlowPlanSelect";
import { BuyFlowSuccessPage } from "./success/BuyFlowSuccessPage";

export type AlternativeT = {
  title: string;
  period: "month" | "year";
  key: string;
  save_percentage?: number;
};

export const BuyFlowDialog: FC<{
  children: ReactNode;
  title?: string;
  price_key?: string;
  alternatives?: AlternativeT[];
}> = ({ children, alternatives, price_key, title }) => {
  const { flowState, setFlowState, resetFlowState, setPage } = useBuyFlow();
  const price = usePriceByPriceKey(price_key);
  const isSubscription =
    flowState.product_info?.subscription_period !== undefined;

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          resetFlowState();

          return;
        }

        if (alternatives !== undefined) {
          setFlowState({
            ...flowState,
            title,
            price_key,
          });
          setPage("plan");
        } else if (price_key !== undefined) {
          setFlowState({
            ...flowState,
            title,
            price_key,
            product_id: price?.product_id!,
          });
          setPage("payment");
        } else {
          alert("Invalid configured buy flow. Please report this issue.");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
      >
        {flowState.page == "plan" && alternatives !== undefined && (
          <BuyFlowPlanSelect alternatives={alternatives} />
        )}

        {flowState.page == "payment" && <BuyFlowPayment />}
        {flowState.page == "add_card" && (
          <BuyFlowAddCard
            back={
              <DialogClose asChild>
                <FooterBackButton
                  onClick={(event) => {
                    if (isSubscription) {
                      event.preventDefault();
                      setPage("plan");
                    }
                  }}
                />
              </DialogClose>
            }
          />
        )}
        {flowState.page == "success" && <BuyFlowSuccessPage />}
      </DialogContent>
    </Dialog>
  );
};
