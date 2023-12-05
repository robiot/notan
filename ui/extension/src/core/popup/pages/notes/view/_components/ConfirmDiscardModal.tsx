import { FC } from "react";

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/core/popup/components/ui/dialog";

export const ConfirmDiscardModal: FC = () => {
  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </>
  );
};
