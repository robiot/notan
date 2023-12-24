import { Button } from "@notan/components/ui/button";
import Image from "next/image";
import { FC } from "react";

import { Price } from "@/hooks/billing/usePrices";
import { useProduct } from "@/hooks/billing/useProduct";
import { cn } from "@/lib/utils";

const getTitleForLookupKey = (lookupKey: string) => {
  switch (lookupKey) {
    case "20_note_storage":
      return "+20 Note Storage";
    case "40_note_storage":
      return "+40 Note Storage";
    case "100_note_length":
      return "+100 Note Length";
    case "200_note_length":
      return "+200 Note Length";
    default:
      return "";
  }
};
const getDescriptionForLookupKey = (lookupKey: string) => {
  switch (lookupKey) {
    case "20_note_storage":
      return "Increase note storage by 20 for your account.";
    case "40_note_storage":
      return "Increase note storage by 40 for your account.";
    case "100_note_length":
      return "Increase note length by 100 for your account.";
    case "200_note_length":
      return "Increase note length by 200 for your account.";
    default:
      return "";
  }
};

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
        "flex flex-col gap-0 p-7 rounded-2xl",
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

      <span className="text-xl mt-6 font-semibold">
        {getTitleForLookupKey(price?.lookup_key)}
      </span>
      <p className="text-md text-foreground/90">
        {getDescriptionForLookupKey(price?.lookup_key)}
      </p>
      <div className="flex justify-between gap-2 mt-4">
        <span className="text-lg font-bold">{price.price / 100}€</span>
        <span>
          {product.data?.owns}/{product.data?.max} bought
        </span>
      </div>
      <Button
        variant="inverted"
        className="mt-3"
        onClick={() => {
          alert("Not implemented yet. Please check by later.");
        }}
      >
        Buy
      </Button>
    </div>
  );
};
