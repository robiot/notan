import { DialogHeader, DialogTitle } from "@notan/components/ui/dialog";
import { toast } from "@notan/components/ui/use-toast";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FC, ReactNode, useState } from "react";

import { api } from "@/lib/api";
import { StripeAppearance, stripePromise } from "@/lib/stripe";

import { useBuyFlow } from "../../hooks/useBuyFlow";
import { FooterBackButton } from "../BuyFlowFooter";
import { AddressForm } from "./AddressForm";
import { PaymentForm } from "./PaymentForm";

const Form: FC<{
  back: ReactNode;
  done: () => void;
}> = ({ back }) => {
  const [page, setPage] = useState<"paymentform" | "addressform">(
    "paymentform"
  );
  const stripe = useStripe();
  const payment = useElements();

  const addCard = useMutation({
    mutationFn: async () => {
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
        });

      if (!method) return;

      console.log(method);

      if (method.error) {
        toast({
          title: "Error",
          description: method.error.message,
        });
      }

      await api.post(`/payments/methods/${method.paymentMethod?.id}/attach`, {
        payment_method_id: method.paymentMethod?.id,
      });

      // console.log(error, paymentMethod);
      // next();
    },
    mutationKey: ["add_card"],
  });

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        // addCard.mutate();
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
            addCard.mutate();
          }}
        />
      </motion.div>
    </form>
  );
};

export const BuyFlowAddCard: FC<{
  back: ReactNode;
}> = ({ back }) => {
  const buyFlow = useBuyFlow();

  return (
    <div className="flex flex-col gap-6">
      <DialogHeader>
        <DialogTitle className="text-2xl">Add a card</DialogTitle>
      </DialogHeader>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "setup",
          paymentMethodCreation: "manual",
          currency: "eur",
          appearance: StripeAppearance,
        }}
      >
        <Form
          back={back}
          done={() => {
            buyFlow.setPage("payment");
          }}
        />
      </Elements>
    </div>
  );
};
