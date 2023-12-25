import { getPriceByLookupKey } from "@/hooks/billing/usePriceByLookupKey";
import { usePrices } from "@/hooks/billing/usePrices";

import { ProductCard } from "./ProductCard";

export const ProductsSection = () => {
  const prices = usePrices();

  if (prices.isLoading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
      <ProductCard
        price={getPriceByLookupKey("10_note_storage", prices.data)}
        imageUrl="/products/storage.svg"
      />
      <ProductCard
        price={getPriceByLookupKey("20_note_storage", prices.data)}
        imageUrl="/products/storage.svg"
        gradient
      />
      <ProductCard
        price={getPriceByLookupKey("100_note_length", prices.data)}
        imageUrl="/products/length.svg"
      />
      <ProductCard
        price={getPriceByLookupKey("200_note_length", prices.data)}
        imageUrl="/products/length.svg"
        gradient
      />
    </div>
  );
};
