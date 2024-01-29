import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@notan/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@notan/components/ui/dialog";
import { DropdownMenuItem } from "@notan/components/ui/dropdown-menu";
import { Input } from "@notan/components/ui/input";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { UpgradeButton } from "@/core/popup/components/app/UpgradeButton";
import { api } from "@/core/popup/lib/api";
import { zodRequiredString } from "@/core/popup/lib/zodPresents";

const AddTagSchema = z.object({
  name: zodRequiredString.max(30, { message: "Max 30 characters" }),
});

export type AddTagSchemaType = z.infer<typeof AddTagSchema>;

export const AddTagButton: FC<{
  refetch: () => void;
}> = ({ refetch }) => {
  // hacky way of opening, but when using state for open, it wont close when clicking X
  const triggerReference = useRef<HTMLButtonElement>(null);
  const closeReference = useRef<HTMLButtonElement>(null);

  const form = useForm<AddTagSchemaType>({
    resolver: zodResolver(AddTagSchema),
  });

  const addTag = useMutation({
    mutationKey: ["addTag"],
    mutationFn: async (name: string) => {
      const response = await api
        .post<ApiResponse<unknown>>("/tags", {
          name,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "max_tags")) {
            toast({
              title: "Max tags reached",
              description: "Upgrade to create more tags",
              action: <UpgradeButton />,
            });
          } else {
            toast({
              title: "Error",
              description: "Something went wrong",
            });
          }
        });

      if (!response) return;

      closeReference.current?.click();
      refetch();
    },
  });

  return (
    <Dialog>
      <DialogTrigger ref={triggerReference} className="hidden" />
      <DropdownMenuItem
        className="flex gap-3 justify-between cursor-pointer"
        onClick={(event) => {
          event.preventDefault();

          triggerReference.current?.click();
        }}>
        <div>Add tag</div>
        <Plus className="w-5 h-5" />
      </DropdownMenuItem>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create tag</DialogTitle>
        </DialogHeader>

        <form className="my-2">
          <Input
            placeholder="Name"
            inputSize="small"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
          />
        </form>
        <DialogFooter className="flex flex-row w-full items-center justify-center gap-2">
          <DialogClose asChild>
            <Button variant="ghost" size="lg" className="w-32" ref={closeReference}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            size="lg"
            className="w-32"
            loading={addTag.isPending}
            onClick={form.handleSubmit((data) => {
              // idk why data is undefeind
              const values = data as any;

              if (!values || !values?.name) return;

              addTag.mutate(values.name);
            })}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
