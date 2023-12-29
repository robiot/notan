import {
  AlertDialog,
  AlertDialogContent,
} from "@notan/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@notan/components/ui/dialog";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BuyFlowSuccessPage } from "../buy_flow/success/BuyFlowSuccessPage";
import { AwaitSubscriptionPage } from "./AwaitSubscriptionPage";

export const PaymentSuccessDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean | undefined>();
  const [page, setPage] = useState<"await" | "success">("await");
  const parameters = useSearchParams();

  // get if query param success is true then show dialog
  useEffect(() => {
    console.log(parameters);

    if (parameters.get("success") == "true") {
      setIsOpen(true);
    }
  }, [parameters]);

  if (isOpen == undefined) return null;

  if (page == "await")
    return (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AwaitSubscriptionPage
            onDone={() => {
              setPage("success");
            }}
          />
        </AlertDialogContent>
      </AlertDialog>
    );

  if (page == "success")
    return (
      <Dialog defaultOpen={isOpen}>
        <DialogContent>
          <BuyFlowSuccessPage />
        </DialogContent>
      </Dialog>
    );
};
