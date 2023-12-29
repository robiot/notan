import { Button } from "@notan/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@notan/components/ui/dialog";
import { Spinner } from "@notan/components/ui/spinner";
import { toast } from "@notan/components/ui/use-toast";
import { FC, useRef } from "react";

import { BillingAddCardForm } from "@/components/app/billing/AddCard/BillingAddCard";
import { PaymentMethodCard } from "@/components/app/billing/PaymentMethodCard";
import { usePaymentMethods } from "@/hooks/billing/usePaymentMethods";

import { MethodOptions } from "./MethodOptions";

export const BillingPaymentMethods: FC = () => {
  const closeReference = useRef<HTMLButtonElement>(null);

  const { data: paymentMethods, isLoading } = usePaymentMethods();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        <>
          <div className="flex flex-col gap-2 max-h-94 overflow-y-auto">
            {paymentMethods?.length === 0 ? (
              <>No payment methods</>
            ) : (
              <>
                {paymentMethods?.map((paymentMethod) => (
                  <div
                    key={paymentMethod.id}
                    className="flex bg-card border border-border rounded p-2 justify-between items-center"
                  >
                    <PaymentMethodCard method={paymentMethod} />
                    <MethodOptions method={paymentMethod} />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex mt-5">
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => {}}>Add payment method</Button>
              </DialogTrigger>
              <DialogClose ref={closeReference} className="hidden" />

              <DialogContent
                onPointerDownOutside={(event) => {
                  event.preventDefault();
                }}
              >
                <DialogHeader>
                  <DialogTitle className="text-2xl mb-3">
                    Add a card
                  </DialogTitle>
                </DialogHeader>
                <BillingAddCardForm
                  back={<></>}
                  done={() => {
                    toast({
                      title: "Success",
                      description: "Payment method added",
                    });
                    closeReference.current?.click();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </>
      </div>
    </>
  );
};
