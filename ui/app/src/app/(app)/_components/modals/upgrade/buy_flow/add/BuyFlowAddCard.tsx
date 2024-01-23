import { DialogHeader, DialogTitle } from "@notan/components/ui/dialog";
import { FC, ReactNode } from "react";

import { BillingAddCardForm } from "@/components/app/billing/AddCard/BillingAddCard";

import { useBuyFlow } from "../../hooks/useBuyFlow";

export const BuyFlowAddCard: FC<{
  back: ReactNode;
}> = ({ back }) => {
  const buyFlow = useBuyFlow();

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add a card</DialogTitle>
      </DialogHeader>

      <BillingAddCardForm
        back={back}
        done={() => {
          buyFlow.setPage("payment");
        }}
      />
    </div>
  );
};
