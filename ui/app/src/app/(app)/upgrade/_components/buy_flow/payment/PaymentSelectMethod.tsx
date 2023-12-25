import { Button } from "@notan/components/ui/button";
import { DialogClose } from "@notan/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@notan/components/ui/select";
import { CreditCard } from "lucide-react";

import { usePaymentMethods } from "@/hooks/billing/usePaymentMethods";
import { usePriceById } from "@/hooks/billing/usePriceById";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { BuyFlowFooter, FooterBackButton } from "../BuyFlowFooter";

const PriceFormated = () => {
  const flow = useBuyFlow();

  const price = usePriceById(flow.flowState.price_id);

  return (
    <>
      {price?.price! / 100}€
      {flow.flowState.product_info?.subscription_period !== undefined && (
        <>/{flow.flowState.product_info?.subscription_period?.period}</>
      )}
    </>
  );
};

export const PaymentBuyPage = () => {
  const buyFlow = useBuyFlow();
  const methods = usePaymentMethods();

  const buyButtonText = () => {
    if (buyFlow.flowState.product_info?.subscription_period !== undefined) {
      return "Subscribe";
    }

    return "Buy";
  };
  const isSubscription =
    buyFlow.flowState.product_info?.subscription_period !== undefined;

  if (!methods.data) return null;

  return (
    <div className="flex flex-col gap-6">
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
          Select payment method ({methods.data?.length})
        </span>
        <Select defaultValue={methods.data?.at(0)?.id}>
          <SelectTrigger className="w-full h-14">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            {methods.data?.map((method) => (
              <SelectItem value={method.id}>
                {method.kind == "card" && (
                  <div className="flex ml-2 gap-5 items-center">
                    <CreditCard />
                    <div className="flex items-start flex-col">
                      <div>**** **** **** {method.card?.last_four}</div>
                      <span>
                        {method.card?.brand} | Expires {method.card?.exp}
                      </span>
                    </div>
                  </div>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="text-xs text-foreground/60">
        {isSubscription ? (
          <>
            By presing {buyButtonText()} you are purchasing a subscription that
            will charge <PriceFormated /> until you cancel. Canceling can be
            done under the Billing page. If you have any questions, please
            contact us.
          </>
        ) : (
          <>
            By presing {buyButtonText()} you are purchasing a one-time payment.
          </>
        )}
      </p>
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
            onClick={() => {
              // buyFlow.setPage("payment");
            }}
          >
            {buyButtonText()}
          </Button>
        }
      />
    </div>
  );
};
