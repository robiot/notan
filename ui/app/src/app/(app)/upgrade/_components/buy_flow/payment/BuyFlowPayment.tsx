import { DialogHeader, DialogTitle } from "@notan/components/ui/dialog";
import { FC } from "react";

import { usePaymentMethods } from "@/hooks/billing/usePaymentMethods";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { PaymentBuyPage } from "./PaymentSelectMethod";

const Content = () => {
  const methods = usePaymentMethods();

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
