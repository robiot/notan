import { Alert, AlertTitle } from "@notan/components/ui/alert";
import { toast } from "@notan/components/ui/use-toast";
import {
  ApiResponse,
  getDescriptionForError,
  hasError,
} from "@notan/utils/api";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";

import { FooterBackButton } from "@/app/(app)/upgrade/_components/buy_flow/BuyFlowFooter";
import { usePaymentMethods } from "@/hooks/billing/usePaymentMethods";
import { api } from "@/lib/api";
import { StripeAppearance, stripePromise } from "@/lib/stripe";

import { AddressForm } from "./AddressForm";
import { PaymentForm } from "./PaymentForm";

const Form: FC<{
  back: ReactNode;
  done: () => void;
}> = ({ back, done }) => {
  const [page, setPage] = useState<"paymentform" | "addressform">(
    "paymentform"
  );

  const [error, setError] = useState<string | null>();

  const stripe = useStripe();
  const payment = useElements();
  const methods = usePaymentMethods();

  const addCard = useMutation({
    mutationFn: async () => {
      console.log("got submit");
      await payment?.submit();
      const card = payment?.getElement("payment");

      if (!stripe || !payment || !card) {
        toast({
          title: "Error",
          description: "Stripe is not initialized",
        });

        return;
      }

      const method = await stripe
        .createPaymentMethod({
          elements: payment,
        })
        .catch((error) => {
          console.log(error);
          setError("Error: " + error.message);
        });

      if (!method) return;

      if (method.error) {
        setError(method.error.message);

        return;
      }

      if (!method.paymentMethod?.id) {
        setError("No id, try again");

        return;
      }

      const response = await api
        .post<ApiResponse<{ token: string }>>(
          `/payments/methods/${method.paymentMethod?.id}`
        )
        .catch((error: AxiosError) => {
          const response = error.response as AxiosResponse<
            ApiResponse<any>,
            any
          >;

          if (!response) return;

          if (hasError(error.response, "card_error")) {
            setError(
              getDescriptionForError("card_error", response.data.errors)
            );
          } else if (hasError(error.response, "method_error")) {
            setError(
              getDescriptionForError("method_error", response.data.errors)
            );
          }
        });

      if (!response) return;

      await methods.refetch();

      // buyFlow.setPage("payment");
      done();
    },
    mutationKey: ["add_card"],
  });

  // Reset error when page changes
  useEffect(() => {
    setError(null);
  }, [page]);

  return (
    <>
      {error && (
        <Alert className="bg-destructive">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <form
        onSubmit={async (event) => {
          event.preventDefault();
        }}
      >
        <PaymentForm
          visible={page === "paymentform"}
          back={back}
          next={() => {
            setPage("addressform");
          }}
        />

        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              x: -20,
            },
            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          initial="hidden"
          animate={page === "addressform" ? "visible" : "hidden"}
          transition={{
            duration: 0.2,
          }}
        >
          <AddressForm
            visible={page === "addressform"}
            back={
              <FooterBackButton
                onClick={() => {
                  setPage("paymentform");
                }}
              />
            }
            loading={addCard.isPending}
            next={() => {
              console.log("next");
              addCard.mutate();
            }}
          />
        </motion.div>
      </form>
    </>
  );
};

export const BillingAddCardForm: FC<{
  back: ReactNode;
  done: () => void;
}> = ({ back, done }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "setup",
        paymentMethodCreation: "manual",
        currency: "eur",
        appearance: StripeAppearance,
      }}
    >
      <Form back={back} done={done} />
    </Elements>
  );
};
