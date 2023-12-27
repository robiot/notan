import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@notan/components/ui/alert";
import { Button } from "@notan/components/ui/button";
import { DialogClose } from "@notan/components/ui/dialog";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { CreditCard } from "lucide-react";
import { useState } from "react";

import { usePriceById } from "@/hooks/billing/usePriceById";
import { useProduct } from "@/hooks/billing/useProduct";
import { useUser } from "@/hooks/users/useUser";
import { api } from "@/lib/api";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { BuyFlowFooter, FooterBackButton } from "../BuyFlowFooter";
import { PaymentMethods } from "./PaymentMethods";

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
  const user = useUser();
  const buyFlow = useBuyFlow();
  const product = useProduct(buyFlow.flowState.product_id);

  const [alertError, setAlertError] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const isSubscription =
    buyFlow.flowState.product_info?.subscription_period !== undefined;

  const buyButtonText = () => {
    if (isSubscription) {
      return "Subscribe";
    }

    return "Buy";
  };

  const purchase = useMutation({
    mutationKey: ["purchase", buyFlow.flowState.price_id],
    mutationFn: async () => {
      if (isSubscription) return;

      console.log(buyFlow.flowState.payment_method_id);
      const response = await api
        .post<ApiResponse<unknown>>(
          `/payments/buy/${buyFlow.flowState.price_id}/intent`,
          {
            payment_method_id: buyFlow.flowState.payment_method_id,
          }
        )
        .catch((error: AxiosError) => {
          const response = error.response as AxiosResponse<
            ApiResponse<any>,
            any
          >;

          if (!response) return;

          if (hasError(error.response, "card_error")) {
            setAlertError({
              title: "Card declined",
              // get description from card_error
              description:
                response.data.errors.find((error) => error.name == "card_error")
                  ?.message ?? "unknown",
            });
          } else if (hasError(error.response, "payment_error")) {
            setAlertError({
              title: "Something went wrong with the payment",
              description:
                response.data.errors.find(
                  (error) => error.name == "payment_error"
                )?.message ?? "unknown",
            });
          }
        });

      if (!response) return;

      user.refetch();
      product.refetch();
      buyFlow.setPage("success");
    },
  });

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
            loading={purchase.isPending}
            onClick={() => {
              purchase.mutate();
            }}
          >
            {buyButtonText()}
          </Button>
        }
      />
    </div>
  );
};
