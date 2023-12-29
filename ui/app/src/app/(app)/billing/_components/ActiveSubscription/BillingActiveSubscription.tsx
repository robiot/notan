import { Spinner } from "@notan/components/ui/spinner";
import { FC } from "react";

import { useActiveSubscription } from "@/hooks/billing/useActiveSubscription";
import { formatDate } from "@/lib/utils";

import { CancelSubscription } from "./Cancel";

export const BillingActiveSubscriptions: FC = () => {
  const activeSubscription = useActiveSubscription();

  if (activeSubscription.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (
    activeSubscription.data?.notFound ||
    !activeSubscription.data?.subscription
  ) {
    return (
      <p>
        You don't have an active subscription. Start a subscription on the
        Upgrade page.
      </p>
    );
  }

  return (
    <div className="flex flex-col bg-purple-blue-gradient p-8 rounded-xl">
      <span className="text-xl font-bold">
        {activeSubscription.data?.subscription?.product?.name}
      </span>

      <div className="mt-3">
        Your subscription will automatically renew on{" "}
        {formatDate(activeSubscription.data.subscription.end_date)}.
      </div>

      <CancelSubscription />
    </div>
  );
};
