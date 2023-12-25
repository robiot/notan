import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@notan/components/ui/dialog";
import { FC, ReactNode } from "react";

import { useBuyFlow } from "../hooks/useBuyFlow";
import { BuyFlowPayment } from "./payment/BuyFlowPayment";
import { BuyFlowPlanSelect } from "./planselect/BuyFlowPlanSelect";

export type AlternativeT = {
  title: string;
  period: "month" | "year";
  key: string;
  save_percentage?: number;
};

export const BuyFlowDialog: FC<{
  children: ReactNode;
  title?: string;
  price_id?: string;
  alternatives?: AlternativeT[];
}> = ({ children, alternatives, price_id, title }) => {
  const { flowState, setFlowState, resetFlowState, setPage } = useBuyFlow();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          resetFlowState();

          return;
        }

        setFlowState({
          ...flowState,
          title,
          price_id,
        });

        if (alternatives !== undefined) {
          setPage("plan");
        } else if (price_id !== undefined) {
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
      </DialogContent>
    </Dialog>
  );
};
