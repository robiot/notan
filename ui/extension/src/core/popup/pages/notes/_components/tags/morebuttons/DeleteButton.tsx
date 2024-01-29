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
import { FC } from "react";

import { Tag } from "@/core/popup/hooks/tags/useTags";
import { api } from "@/core/popup/lib/api";

export const TagDeleteButton: FC<{
  tag: Tag;
  refetch: () => void;
}> = ({ tag, refetch }) => {
  // hacky way of opening, but when using state for open, it wont close when clicking X
  const triggerReference = useRef<HTMLButtonElement>(null);

  const deleteTag = useMutation({
    mutationKey: ["deleteTag", tag],
    mutationFn: async () => {
      console.log("called");
      const response = await api.delete<ApiResponse<unknown>>(`/tags/${tag.id}`).catch((error: AxiosError) => {
        hasError(error.response);
      });

      if (!response) return;

      refetch();
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
        <Trash className="h-5 w-5" />
        Delete
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deleting tag</DialogTitle>
          <DialogDescription className="!mt-3">
            It will be removed from all notes. This action cannot be undone.
          </DialogDescription>
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
            loading={deleteTag.isPending}
            onClick={() => deleteTag.mutate()}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
