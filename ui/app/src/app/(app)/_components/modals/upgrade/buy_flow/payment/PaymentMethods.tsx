import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@notan/components/ui/select";
import { Plus } from "lucide-react";
import { useEffect } from "react";

import { PaymentMethodCard } from "@/components/app/billing/PaymentMethodCard";
import { usePaymentMethods } from "@/hooks/billing/usePaymentMethods";

import { useBuyFlow } from "../../hooks/useBuyFlow";

export const PaymentMethods = () => {
  const buyFlow = useBuyFlow();
  const methods = usePaymentMethods();

  useEffect(() => {
    if (!methods.data || methods.data.length === 0) return;

    buyFlow.setFlowState({
      ...buyFlow.flowState,
      payment_method_id: methods.data?.at(0)?.id,
    });
  }, [methods.data]);

  return (
    <Select
      defaultValue={methods.data?.at(0)?.id}
      onValueChange={(value) => {
        // hehe: but it works
        if (value == "add") {
          buyFlow.setPage("add_card");

          return;
        }

        buyFlow.setFlowState({
          ...buyFlow.flowState,
          payment_method_id: value,
        });
      }}
    >
      <SelectTrigger className="w-full h-14">
        <SelectValue placeholder="Method" />
      </SelectTrigger>
      <SelectContent>
        {methods.data?.map((method) => (
          <SelectItem value={method.id} key={`method_${method.id}`}>
            <PaymentMethodCard method={method} />
          </SelectItem>
        ))}
        <SelectItem
          value="add"
          onClick={(event) => {
            console.log("got clicked");
            event.preventDefault();
            buyFlow.setPage("add_card");
          }}
        >
          <div className="flex ml-2 gap-5 py-2 items-center">
            <Plus />
            Add payment method
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
