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
import { DropdownMenuItem } from "@notan/components/ui/dropdown-menu";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useLastOpenNote } from "@/core/popup/hooks/persist/useLastOpenNote";
import { api } from "@/core/popup/lib/api";

export const DeleteButton = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const lastOpenNote = useLastOpenNote();

  // hacky way of opening, but when using state for open, it wont close when clicking X
  const triggerReference = useRef<HTMLButtonElement>(null);

  const deleteNote = useMutation({
    mutationKey: ["deleteNote", id],
    mutationFn: async () => {
      const response = await api.delete<ApiResponse<unknown>>(`/notes/${id}`).catch((error: AxiosError) => {
        hasError(error.response);
      });

      if (!response) return;

      lastOpenNote.clear();
      navigate("/");
    },
  });

  return (
    <Dialog>
      <DialogTrigger ref={triggerReference} className="hidden" />
      <DropdownMenuItem
        className="flex gap-3"
        onClick={(event) => {
          event.preventDefault();

          triggerReference.current?.click();
        }}>
        <Trash />
        Delete
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deleting note</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row w-full items-center justify-center gap-2">
          <DialogClose asChild>
            <Button variant="ghost" size="lg" className="w-32">
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            size="lg"
            className="w-32"
            loading={deleteNote.isPending}
            onClick={() => deleteNote.mutate()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
