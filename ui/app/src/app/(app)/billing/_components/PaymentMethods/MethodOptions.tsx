import { Button } from "@notan/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@notan/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { FC } from "react";

import { PaymentMethod } from "@/hooks/billing/usePaymentMethods";

import { DeleteButton } from "./DeleteButton";

export const MethodOptions: FC<{
  method: PaymentMethod;
}> = ({ method }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" onClick={() => {}}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DeleteButton method={method} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
