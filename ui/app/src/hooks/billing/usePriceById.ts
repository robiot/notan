import { Price, usePrices } from "./usePrices";

export const usePriceById = (id?: string) => {
  const { data: prices } = usePrices();

  if (!id) return;

  return getPriceById(id, prices);
};

export const getPriceById = (id: string, prices?: Price[]) => {
  return prices?.find((price) => price.price_id === id);
};
