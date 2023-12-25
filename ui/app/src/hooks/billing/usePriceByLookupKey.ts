import { Price, usePrices } from "./usePrices";

export const getTitleForLookupKey = (lookupKey: string) => {
  switch (lookupKey) {
    case "10_note_storage":
      return "+10 Note Storage";
    case "20_note_storage":
      return "+20 Note Storage";
    case "100_note_length":
      return "+100 Note Length";
    case "200_note_length":
      return "+200 Note Length";
    default:
      return "";
  }
};

export const getDescriptionForLookupKey = (lookupKey: string) => {
  switch (lookupKey) {
    case "10_note_storage":
      return "Increase note storage by 10 for your account.";
    case "20_note_storage":
      return "Increase note storage by 20 for your account.";
    case "100_note_length":
      return "Increase note length by 100 for your account.";
    case "200_note_length":
      return "Increase note length by 200 for your account.";
    default:
      return "";
  }
};

export const usePriceByLookupKey = (lookupKey?: string) => {
  const { data: prices } = usePrices();

  if (!lookupKey) return;

  return getPriceByLookupKey(lookupKey, prices);
};

export const getPriceByLookupKey = (lookupKey: string, prices?: Price[]) => {
  return prices?.find((price) => price.lookup_key === lookupKey);
};
