import { Button } from "@notan/components/ui/button";
import { AddressElement } from "@stripe/react-stripe-js";
import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { BuyFlowFooter } from "../BuyFlowFooter";

export const AddressForm: FC<{
  visible: boolean;
  back: ReactNode;
  next: () => void;
  loading?: boolean;
}> = ({ visible, back, next, loading }) => {
  return (
    <div className={cn(visible ? "block" : "hidden")}>
      <AddressElement
        options={{
          mode: "billing",
        }}
      />
      <BuyFlowFooter
        back={back}
        next={
          <Button
            type="submit"
            className="w-32"
            loading={loading}
            onClick={async () => {
              next();
            }}
          >
            Add
          </Button>
        }
      />
    </div>
  );
};
