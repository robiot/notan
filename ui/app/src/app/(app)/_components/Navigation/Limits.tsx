import { Button } from "@notan/components/ui/button";
import { Spinner } from "@notan/components/ui/spinner";
import { Rocket } from "lucide-react";

import { useActiveSubscription } from "@/hooks/billing/useActiveSubscription";
import { useUser } from "@/hooks/users/useUser";
import { cn } from "@/lib/utils";

import { UpgradeModal } from "../modals/upgrade/UpgradeModal";

export const Limits = () => {
  const user = useUser();
  const activeSubscription = useActiveSubscription();

  if (activeSubscription.isLoading || !user) return <Spinner />;

  if (
    !activeSubscription.data?.notFound &&
    activeSubscription.data?.subscription
  ) {
    return <></>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <span className="text-sm">Notes</span>
        <span className="text-sm">
          {user.data?.used_note_storage}/{user.data?.total_note_storage}
        </span>
      </div>
      <div className="py-2 flex flex-col gap-1">
        <div className="rounded-full h-3 w-full bg-accent relative overflow-hidden">
          {user.data?.used_note_storage !== undefined &&
            user.data?.total_note_storage !== undefined && (
              <>
                <div
                  className={cn(
                    "rounded-full h-3",
                    user.data?.used_note_storage >=
                      user.data?.total_note_storage
                      ? "bg-red-500"
                      : "bg-primary"
                  )}
                  style={{
                    width: `${Math.min(
                      (user.data?.used_note_storage /
                        user.data?.total_note_storage) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </>
            )}
        </div>
      </div>

      <UpgradeModal>
        <Button className="w-full flex gap-2 mt-4">
          Upgrade
          <Rocket className="w-5" />
        </Button>
      </UpgradeModal>
    </div>
  );
};
