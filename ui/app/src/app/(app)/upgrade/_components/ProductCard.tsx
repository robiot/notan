import { Button } from "@notan/components/ui/button";
import Image from "next/image";
import { FC } from "react";

import {
  getDescriptionForPriceKey,
  getTitleForPriceKey,
} from "@/hooks/billing/usePriceByPriceKey";
import { Price } from "@/hooks/billing/usePrices";
import { useProduct } from "@/hooks/billing/useProduct";
import { cn } from "@/lib/utils";

import { BuyFlowDialog } from "./buy_flow/BuyFlowDialog";

export const ProductCard: FC<{
  price?: Price;
  imageUrl: string;
  gradient?: boolean;
}> = ({ price, imageUrl, gradient }) => {
  const product = useProduct(price?.product_id);

  if (!price) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-0 p-14 rounded-2xl",
        gradient ? "bg-purple-blue-gradient" : "bg-card"
      )}
    >
      <Image
        alt="product"
        src={imageUrl}
        width={200}
        height={200}
        className="h-28 self-center"
      />

      <span className="text-xl mt-12 font-semibold">
        {getTitleForPriceKey(price?.price_key)}
      </span>
      <p className="text-md text-foreground/90">
        {getDescriptionForPriceKey(price?.price_key)}
      </p>
      <div className="flex justify-between gap-2 mt-4">
        <span className="text-lg font-bold">{price.price / 100}€</span>
        <span>
          {product.data?.owns}/{product.data?.max} bought
        </span>
      </div>

      <BuyFlowDialog
        price_key={price.price_key}
        title={getTitleForPriceKey(price?.price_key)}
      >
        <Button
          variant="inverted"
          className="mt-3"
          disabled={
            product.data?.owns !== undefined &&
            product.data?.owns >= product.data?.max
          }
        >
          Buy
        </Button>
      </BuyFlowDialog>
    </div>
  );
};
