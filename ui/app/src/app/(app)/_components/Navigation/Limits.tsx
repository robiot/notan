import { Button } from "@notan/components/ui/button";
import { Spinner } from "@notan/components/ui/spinner";
import { Check, Pocket, X } from "lucide-react";
import Link from "next/link";

import { useUser } from "@/hooks/users/useUser";
import { cn } from "@/lib/utils";

export const Limits = () => {
  const user = useUser();

  if (!user) return <Spinner />;

  return (
    <div className="flex flex-col">
      <span className="text-xl">Limits</span>
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
        <div className="flex justify-between">
          <span className="text-sm">Notes</span>
          <span className="text-sm">
            {user.data?.used_note_storage}/{user.data?.total_note_storage}
          </span>
        </div>
      </div>

      <div className="flex justify-between py-2">
        <span className="text-sm">Max note length</span>
        <span className="text-sm">{user.data?.max_note_length}</span>
      </div>

      <div className="flex justify-between py-2">
        <span className="text-sm">No domain restrictions</span>
        <span className="text-sm">
          {user.data?.has_unlimited_notes_per_domain ? (
            <>
              <Check className="h-5 text-green-600" />
            </>
          ) : (
            <>
              <X className="h-5" />
            </>
          )}
        </span>
      </div>

      <Button className="w-full flex gap-2 mt-4" asChild>
        <Link href="/upgrade">
          Upgrade
          <Pocket className="w-5" />
        </Link>
      </Button>
    </div>
  );
};
