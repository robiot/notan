import { Book, CheckCircle, Edit } from "lucide-react";

import { usePrices } from "@/hooks/billing/usePrices";

import { SubscriptionCard } from "./SubscriptionCard";

export const SubscriptionsSection = () => {
  const prices = usePrices();

  const getSubscriptionByLookupKey = (lookupKey: string) => {
    return prices.data?.find((price) => price.lookup_key === lookupKey);
  };

  if (prices.isLoading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <SubscriptionCard
        price={getSubscriptionByLookupKey("plus_monthly")}
        title="Plus"
        perks={[
          {
            icon: <Book />,
            text: "190 notes",
          },
          {
            icon: <Edit />,
            text: "900 max note length",
          },
          {
            icon: <CheckCircle />,
            text: "No restrictions per domain!",
          },
        ]}
        gradient="blue"
      />
      <SubscriptionCard
        price={getSubscriptionByLookupKey("plus_monthly")}
        title="Premium"
        perks={[
          {
            icon: <Book />,
            text: "560 notes",
          },
          {
            icon: <Edit />,
            text: "2000 max note length",
          },
          {
            icon: <CheckCircle />,
            text: "No restrictions per domain!",
          },
        ]}
        gradient="purple"
      />
    </div>
  );
};
