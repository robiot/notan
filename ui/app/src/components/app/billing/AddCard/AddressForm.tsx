import { Button } from "@notan/components/ui/button";
import { AddressElement } from "@stripe/react-stripe-js";
import { FC, ReactNode } from "react";

import { BuyFlowFooter } from "@/components/common/FlowFooter";
import { cn } from "@/lib/utils";

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
            type="button"
            className="w-32"
            loading={loading}
            onClick={async () => {
              console.log("clicked");
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
