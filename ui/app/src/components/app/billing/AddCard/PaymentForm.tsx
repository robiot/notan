import { Button } from "@notan/components/ui/button";
import { PaymentElement, useElements } from "@stripe/react-stripe-js";
import { StripePaymentElementChangeEvent } from "@stripe/stripe-js";
import { FC, ReactNode, useEffect, useState } from "react";

import { BuyFlowFooter } from "@/app/(app)/upgrade/_components/buy_flow/BuyFlowFooter";
import { cn } from "@/lib/utils";

export const PaymentForm: FC<{
  visible: boolean;
  back: ReactNode;
  next: () => void;
}> = ({ visible, back, next }) => {
  const payment = useElements();

  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const cardElement = payment?.getElement("payment");

    if (cardElement) {
      const changeEventHandler = (event: StripePaymentElementChangeEvent) => {
        setComplete(event.complete);
      };

      cardElement.on("change", changeEventHandler);

      return () => {
        cardElement.off("change", changeEventHandler);
      };
    }
  }, [payment]);

  return (
    <div className={cn(visible ? "block" : "hidden")}>
      <PaymentElement
        options={{
          fields: {
            billingDetails: {
              address: {
                country: "never",
                postalCode: "never",
              },
            },
          },
        }}
      />

      <BuyFlowFooter
        back={back}
        next={
          <Button
            type="button"
            className="w-32"
            disabled={!complete}
            onClick={async () => {
              next();
            }}
          >
            Continue
          </Button>
        }
      />
    </div>
  );
};
