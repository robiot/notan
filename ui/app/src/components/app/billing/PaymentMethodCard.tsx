import { CreditCard } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

import { PaymentMethod } from "@/hooks/billing/usePaymentMethods";
import { formatCardBrand, getCardImageFromBrand } from "@/lib/card";

const CardImage: FC<{ brand: string }> = ({ brand }) => {
  const img = getCardImageFromBrand(brand);

  if (!img) {
    return <CreditCard className="w-[35px]" />;
  }

  return (
    <Image alt="card" src={img} width={35} height={24} className="rounded-md" />
  );
};

export const PaymentMethodCard: FC<{
  method: PaymentMethod;
}> = ({ method }) => {
  return (
    <>
      {method.kind == "card" && method.card !== undefined && (
        <div className="flex ml-2 gap-5 items-center">
          <CardImage brand={method.card.brand} />
          <div className="flex items-start flex-col">
            <div>
              {formatCardBrand(method.card.brand)} ending with{" "}
              {method.card.last_four}
            </div>
            <span className="text-sm">Expires {method.card.exp}</span>
          </div>
        </div>
      )}
    </>
  );
};
