import { DialogHeader, DialogTitle } from "@notan/components/ui/dialog";
import { FC, useEffect } from "react";

import { usePaymentMethods } from "@/hooks/billing/usePaymentMethods";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { PaymentBuyPage } from "./PaymentBuyPage";

const Content = () => {
  const buyFlow = useBuyFlow();
  const methods = usePaymentMethods();

  useEffect(() => {
    if (methods.isLoading) return;

    if (!methods.data || methods.data.length === 0) {
      buyFlow.setPage("add_card");
    }
  }, [methods.data, methods.isLoading]);

  if (methods.isLoading) {
    return <div>Loading...</div>;
  }

  if (methods.data && methods.data.length > 0) {
    return <PaymentBuyPage />;
  }
};

export const BuyFlowPayment: FC = () => {
  const buyFlow = useBuyFlow();

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl">
          {buyFlow.flowState.title}
        </DialogTitle>
      </DialogHeader>

      <Content />
    </>
  );
};
