import { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/core/popup/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/popup/components/ui/dialog";

export const UnsavedChangesModal: FC<{ loading?: boolean; onSave: () => void }> = ({ loading, onSave }) => {
  const navigate = useNavigate();

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>You have unsaved changes</DialogTitle>
        <DialogDescription>Do you wish to save?</DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex flex-row w-full items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="lg"
          className="w-32"
          onClick={() => {
            navigate("/");
          }}>
          Discard
        </Button>
        <Button variant="default" size="lg" className="w-32" loading={loading} onClick={onSave}>
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
