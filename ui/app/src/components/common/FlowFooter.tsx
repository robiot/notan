import { Button } from "@notan/components/ui/button";
import { DialogFooter } from "@notan/components/ui/dialog";
import { Separator } from "@notan/components/ui/separator";
import { ChevronLeft, Lock } from "lucide-react";
import { DOMAttributes, FC, ReactNode } from "react";

export const BuyFlowFooterNotice = () => {
  return (
    <div className="flex text-sm w-full gap-2 justify-center items-center text-foreground/80">
      <Lock className="h-4" />
      Secure payments with Stripe
    </div>
  );
};

export const FooterBackButton: FC<{
  onClick: DOMAttributes<HTMLButtonElement>["onClick"];
}> = ({ onClick }) => {
  return (
    <Button className="px-0 pr-3" variant="ghost" onClick={onClick}>
      <ChevronLeft />
      Back
    </Button>
  );
};

export const BuyFlowFooter: FC<{
  back?: ReactNode;
  next: ReactNode;
}> = ({ back, next }) => {
  return (
    <DialogFooter className="mt-6">
      <div className="flex flex-col w-full gap-6">
        <div className="w-full justify-between flex gap-2">
          <div>{back}</div>
          {next}
        </div>
        <Separator />
        <BuyFlowFooterNotice />
      </div>
    </DialogFooter>
  );
};
