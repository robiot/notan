import { getPriceByPriceKey } from "@/hooks/billing/usePriceByPriceKey";
import { usePrices } from "@/hooks/billing/usePrices";

import { ProductCard } from "./ProductCard";

export const ProductsSection = () => {
  const prices = usePrices();

  if (prices.isLoading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-2 gap-4">
      <ProductCard
        price={getPriceByPriceKey("ot_notes_1", prices.data)}
        imageUrl="/products/storage.svg"
      />
      <ProductCard
        price={getPriceByPriceKey("ot_note_length_1", prices.data)}
        imageUrl="/products/length.svg"
      />
    </div>
  );
};
