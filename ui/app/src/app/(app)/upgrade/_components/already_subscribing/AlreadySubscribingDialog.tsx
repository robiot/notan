import { Button } from "@notan/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@notan/components/ui/dialog";
import Link from "next/link";
import { FC, ReactNode } from "react";

export const AlreadySubscribingDialog: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Already subscribing</DialogTitle>
        </DialogHeader>
        <p>
          You need to cancel your current subscription before subscribing to a
          new one.
        </p>
        <p>
          You can do that by going to{" "}
          <Link href="/billing" className="text-blue-600 hover:underline">
            Billing
          </Link>
        </p>

        <DialogClose asChild>
          <Button className="mt-8">Ok</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
