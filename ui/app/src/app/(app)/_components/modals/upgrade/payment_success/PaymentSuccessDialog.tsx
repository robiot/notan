import {
  AlertDialog,
  AlertDialogContent,
} from "@notan/components/ui/alert-dialog";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BuyFlowSuccessPage } from "../buy_flow/success/BuyFlowSuccessPage";
import { AwaitSubscriptionPage } from "./AwaitSubscriptionPage";

export const PaymentSuccessDialog = () => {
  const parameters = useSearchParams();

  const [isOpen, setIsOpen] = useState<boolean | undefined>();
  const [page, setPage] = useState<"await" | "success">("await");

  // get if query param success is true then show dialog
  useEffect(() => {
    if (parameters.get("success") == "true") {
      setIsOpen(true);
    }
  }, [parameters]);

  if (isOpen == undefined) return null;

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent className="!outline-0">
        {page == "await" && (
          <AwaitSubscriptionPage
            onDone={() => {
              setPage("success");
            }}
          />
        )}

        {page == "success" && <BuyFlowSuccessPage />}
      </AlertDialogContent>
    </AlertDialog>
  );
};
