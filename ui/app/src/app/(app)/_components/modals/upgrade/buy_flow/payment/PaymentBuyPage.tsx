import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@notan/components/ui/alert";
import { Button } from "@notan/components/ui/button";
import { DialogClose } from "@notan/components/ui/dialog";
import { CreditCard } from "lucide-react";
import { useState } from "react";

import {
  BuyFlowFooter,
  FooterBackButton,
} from "@/components/common/FlowFooter";
import { useBuy } from "@/hooks/actions/useBuy";
import { usePriceByPriceKey } from "@/hooks/billing/usePriceByPriceKey";
import { useUser } from "@/hooks/users/useUser";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { PaymentMethods } from "./PaymentMethods";

const PriceFormated = () => {
  const flow = useBuyFlow();

  const price = usePriceByPriceKey(flow.flowState.price_key);

  return (
    <>
      ${price?.price! / 100}
      {flow.flowState.product_info?.subscription_period !== undefined && (
        <>/{flow.flowState.product_info?.subscription_period?.period}</>
      )}
    </>
  );
};

export const PaymentBuyPage = () => {
  const user = useUser();
  const buyFlow = useBuyFlow();

  const [alertError, setAlertError] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const paySubscription = useBuy({
    setAlertError,
  });

  const isSubscription =
    buyFlow.flowState.product_info?.subscription_period !== undefined;

  const buyButtonText = () => {
    if (isSubscription) {
      return "Subscribe";
    }

    return "Buy";
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6">
        {alertError !== null && (
          <Alert variant="destructive">
            <CreditCard className="h-4 w-4" />
            <AlertTitle>{alertError?.title}</AlertTitle>
            <AlertDescription>{alertError?.description}</AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-foreground/80">Details</span>
          <div className="flex bg-card p-4 rounded justify-between">
            <span>
              {buyFlow.flowState.title}{" "}
              {buyFlow.flowState.product_info?.subscription_period?.title}
            </span>
            <span>
              <PriceFormated />
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-foreground/80">
            Select payment method
          </span>
          <PaymentMethods />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xs text-foreground/60">
            {isSubscription ? (
              <>
                By presing {buyButtonText()} you are purchasing a subscription
                that will charge <PriceFormated /> until you cancel. Canceling
                can be done under the Billing page. If you have any questions,
                please contact us.
              </>
            ) : (
              <>
                By presing {buyButtonText()} you are purchasing a one-time
                payment.
              </>
            )}
          </p>
          <p className="text-xs text-foreground/60">
            A receipt will be sent to{" "}
            <span className="font-bold">{user.data?.email}</span>
          </p>
        </div>
      </div>

      <BuyFlowFooter
        back={
          <DialogClose asChild>
            <FooterBackButton
              onClick={(event) => {
                if (isSubscription) {
                  event.preventDefault();
                  buyFlow.setPage("plan");
                }
              }}
            />
          </DialogClose>
        }
        next={
          <Button
            className="mt-2 px-8"
            loading={paySubscription.isPending}
            onClick={() => {
              // So stripe 3d secure can work
              document.body.style.pointerEvents = "";

              paySubscription.mutate({
                payment_method_id: buyFlow.flowState.payment_method_id!,
                price_key: buyFlow.flowState.price_key!,
                product_id: buyFlow.flowState.product_id!,
                payment_type: isSubscription ? "subscribe" : "intent",
              });
            }}
          >
            {buyButtonText()}
          </Button>
        }
      />
    </div>
  );
};
