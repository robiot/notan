import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@notan/components/ui/select";
import { CreditCard } from "lucide-react";
import { useEffect } from "react";

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
        console.log("changed", value);
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
            {method.kind == "card" && (
              <div className="flex ml-2 gap-5 items-center">
                <CreditCard />
                <div className="flex items-start flex-col">
                  <div>**** **** **** {method.card?.last_four}</div>
                  <span>
                    {method.card?.brand} | Expires {method.card?.exp}
                  </span>
                </div>
              </div>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
