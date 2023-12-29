import { Book, CheckCircle, Edit } from "lucide-react";

import { getPriceByLookupKey } from "@/hooks/billing/usePriceByLookupKey";
import { usePrices } from "@/hooks/billing/usePrices";

import { SubscriptionCard } from "./SubscriptionCard";

export const SubscriptionsSection = () => {
  const prices = usePrices();

  if (prices.isLoading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <SubscriptionCard
        price={getPriceByLookupKey("plus_monthly", prices.data)}
        title="Plus"
        alternatives={[
          {
            title: "Annualy",
            key: "plus_annual",
            period: "year",
            save_percentage: 16,
          },
          {
            title: "Monthly",
            period: "month",
            key: "plus_monthly",
          },
        ]}
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
            text: "No note limit per domain!",
            tooltip:
              "By default you can only create 10 notes for ex. wikipedia.com",
          },
        ]}
        gradient="blue"
      />
      <SubscriptionCard
        price={getPriceByLookupKey("premium_monthly", prices.data)}
        title="Premium"
        alternatives={[
          {
            title: "Annualy",
            key: "premium_annual",
            save_percentage: 16,
            period: "year",
          },
          {
            title: "Monthly",
            key: "premium_monthly",
            period: "month",
          },
        ]}
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
            text: "No note limit per domain!",
            tooltip:
              "By default you can only create 10 notes for ex. wikipedia.com",
          },
        ]}
        gradient="purple"
      />
    </div>
  );
};
