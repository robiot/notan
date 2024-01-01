import { Separator } from "@notan/components/ui/separator";
import { Spinner } from "@notan/components/ui/spinner";
import { captureMessage } from "@sentry/nextjs";
import { useSearchParams } from "next/navigation";
import { FC, useEffect } from "react";

import { useActiveSubscription } from "@/hooks/billing/useActiveSubscription";
import { useProduct } from "@/hooks/billing/useProduct";
import { useUser } from "@/hooks/users/useUser";
import { stripePromise } from "@/lib/stripe";

export const AwaitSubscriptionPage: FC<{
  onDone: () => void;
}> = ({ onDone }) => {
  const parameters = useSearchParams();

  const subscription = useActiveSubscription();
  const user = useUser();
  const product = useProduct(parameters.get("product_id") ?? "");

  const paymentIntentId = parameters.get("payment_intent_client_secret");

  useEffect(() => {
    if (paymentIntentId == null) return;

    const checkPaymentStatus = async () => {
      const stripe = await stripePromise;

      console.log("checking payment status");

      if (stripe == null) return;

      const paymentIntent = await stripe.retrievePaymentIntent(paymentIntentId);

      if (paymentIntent.error) {
        captureMessage(
          "Payment intent retrieve error" + paymentIntent.error.message,
          "error"
        );

        alert(paymentIntent.error.message);

        return;
      }

      if (paymentIntent.paymentIntent == null) {
        captureMessage("Payment intent was undefined", "fatal");

        alert("Unexpected error");

        return;
      }

      if (paymentIntent.paymentIntent.status === "succeeded") {
        console.log("its done");
        clearInterval(paymentStatusInterval); // Stop checking once payment is successful

        // Since we not have new limits, we need to refetch the data
        await subscription.refetch();
        await user.refetch();
        await product.refetch();

        onDone();
      } else {
        console.log(`Payment status: ${paymentIntent.paymentIntent.status}`);
      }
    };

    const paymentStatusInterval = setInterval(checkPaymentStatus, 1000); // Check every second

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(paymentStatusInterval);
  }, [paymentIntentId]); // Re-run effect when paymentIntentId changes

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5">
      <div className="flex flex-col items-center gap-5 text-lg text-foreground/80">
        <Spinner size="md" />
        Awaiting payment to be finalized...
      </div>

      <Separator />
      <div className="flex flex-col items-center text-center">
        <div className="text-md text-foreground/70">
          Ahh, another wait?? Don't worry it won't take long...
        </div>

        <div className="mt-1 text-sm text-foreground/70">
          Not loading, please email us at info@notan.ax
        </div>
      </div>
    </div>
  );
};
