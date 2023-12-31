import { Separator } from "@notan/components/ui/separator";
import { Spinner } from "@notan/components/ui/spinner";
import { FC, useEffect } from "react";

import { useActiveSubscription } from "@/hooks/billing/useActiveSubscription";

export const AwaitSubscriptionPage: FC<{
  onDone: () => void;
}> = ({ onDone }) => {
  const subscription = useActiveSubscription();

  useEffect(() => {
    // refetch subscription every second until subscription.data.notFound is false

    const interval = setInterval(() => {
      subscription.refetch();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (subscription.data?.notFound === false) {
      onDone();
    }
  }, [subscription.data?.notFound]);

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
