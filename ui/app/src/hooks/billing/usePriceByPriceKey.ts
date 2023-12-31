import { Price, usePrices } from "./usePrices";

export const getTitleForPriceKey = (price_key: string) => {
  switch (price_key) {
    case "ot_notes_1":
      return "+10 Max notes";
    case "ot_note_length_1":
      return "+100 Note length";
    default:
      return "";
  }
};

export const getDescriptionForPriceKey = (price_key: string) => {
  switch (price_key) {
    case "ot_notes_1":
      return "Increase max notes by 10 for your account.";
    case "ot_note_length_1":
      return "Increase max note character limit by 100.";
    default:
      return "";
  }
};

export const usePriceByPriceKey = (lookupKey?: string) => {
  const { data: prices } = usePrices();

  if (!lookupKey) return;

  return getPriceByPriceKey(lookupKey, prices);
};

export const getPriceByPriceKey = (price_key: string, prices?: Price[]) => {
  return prices?.find((price) => price.price_key === price_key);
};
