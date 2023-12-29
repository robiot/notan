import { Button } from "@notan/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@notan/components/ui/dialog";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";

import { useActiveSubscription } from "@/hooks/billing/useActiveSubscription";
import { useUser } from "@/hooks/users/useUser";
import { api } from "@/lib/api";

export const CancelSubscription: FC = () => {
  const activeSubscription = useActiveSubscription();
  const user = useUser();

  const cancelSubscription = useMutation({
    mutationKey: [
      "cancelSubscription",
      activeSubscription.data?.subscription?.stripe_subscription_id,
    ],
    mutationFn: async () => {
      const response = await api
        .delete<ApiResponse<unknown>>(
          `/payments/subscriptions/${activeSubscription.data?.subscription?.stripe_subscription_id}/cancel`
        )
        .catch((error: AxiosError) => {
          hasError(error.response);
        });

      if (!response) return;

      await activeSubscription.refetch();
      await user.refetch();

      console.log("cancel subscription");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-fit mt-6 p-0 hover:underline">Cancel</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Cancel subscription</DialogTitle>
          <DialogDescription className="flex flex-col">
            <span>
              You are about to cancel your subscription to Notan. You will lose
              access to all premium features. Cancellation will take effect
              immediately.
            </span>
            <span className="mt-5">You can resubscribe at any time.</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row w-full items-center justify-center gap-2 mt-6">
          <DialogClose asChild>
            <Button variant="ghost" size="lg" className="w-32">
              No
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="lg"
            className="w-32"
            loading={cancelSubscription.isPending}
            onClick={() => {
              cancelSubscription.mutate();
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
