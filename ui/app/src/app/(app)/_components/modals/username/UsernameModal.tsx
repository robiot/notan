import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
} from "@notan/components/ui/alert-dialog";

import { UsernameForm } from "@/components/app/account/UsernameForm";
import { useUser } from "@/hooks/users/useUser";

export const UsernameModal = () => {
  const user = useUser();

  if (user.isLoading || user.data?.username) return null;

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="!outline-0">
        <AlertDialogHeader className="mb-2">
          <div className="text-xl">Just one more step</div>
          <div className="text-foreground/80 font-normal">
            Please choose a username to use on Notan.
          </div>
        </AlertDialogHeader>

        <UsernameForm
          onDone={() => {
            user.refetch();
          }}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
};
