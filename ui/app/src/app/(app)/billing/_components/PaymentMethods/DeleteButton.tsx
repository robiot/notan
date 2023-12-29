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
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import { FC, useRef } from "react";

import {
  PaymentMethod,
  usePaymentMethods,
} from "@/hooks/billing/usePaymentMethods";
import { api } from "@/lib/api";

export const DeleteButton: FC<{
  method: PaymentMethod;
}> = ({ method }) => {
  const paymnetMethods = usePaymentMethods();

  // hacky way of opening, but when using state for open, it wont close when clicking X
  const triggerReference = useRef<HTMLButtonElement>(null);
  const closeReference = useRef<HTMLButtonElement>(null);

  const deleteMethod = useMutation({
    mutationKey: ["deleteMethod", method.id],
    mutationFn: async () => {
      const response = await api
        .delete<ApiResponse<unknown>>(`/payments/methods/${method.id}`)
        .catch((error: AxiosError) => {
          // yes logic looks inverted here, but it worksd
          if (!hasError(error.response)) {
            toast({
              title: "Error",
              description: "Something went wrong",
            });
          }
        });

      if (!response) return;

      await paymnetMethods.refetch();

      closeReference.current?.click();

      console.log(response);
    },
  });

  return (
    <Dialog>
      <DialogTrigger ref={triggerReference} className="hidden" />
      <DialogClose ref={closeReference} className="hidden" />
      <DropdownMenuItem
        className="flex gap-3"
        onClick={(event) => {
          event.preventDefault();

          triggerReference.current?.click();
        }}
      >
        <Trash />
        Delete
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deleting payment method</DialogTitle>
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
            loading={deleteMethod.isPending}
            onClick={() => deleteMethod.mutate()}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
