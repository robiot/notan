import { ProductCard } from "./ProductCard";

export const ProductsSection = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>
  );
};
