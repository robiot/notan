import { SubscrtiptionPerks } from "@notan/components/lib/subscription-perks";

import { getPriceByPriceKey } from "@/hooks/billing/usePriceByPriceKey";
import { usePrices } from "@/hooks/billing/usePrices";

import { SubscriptionCard } from "./SubscriptionCard";

export const SubscriptionsSection = () => {
  const prices = usePrices();

  if (prices.isLoading) return <div>Loading...</div>;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <SubscriptionCard
        price={getPriceByPriceKey("plus_monthly", prices.data)}
        title="Plus"
        alternatives={[
          {
            title: "Annualy",
            key: "plus_annually",
            period: "year",
            save_percentage: 16,
          },
          {
            title: "Monthly",
            period: "month",
            key: "plus_monthly",
          },
        ]}
        perks={SubscrtiptionPerks.plus}
        gradient="blue"
      />
      <SubscriptionCard
        price={getPriceByPriceKey("premium_monthly", prices.data)}
        title="Premium"
        alternatives={[
          {
            title: "Annualy",
            key: "premium_annually",
            save_percentage: 16,
            period: "year",
          },
          {
            title: "Monthly",
            key: "premium_monthly",
            period: "month",
          },
        ]}
        perks={SubscrtiptionPerks.premium}
        gradient="purple"
      />
    </div>
  );
};
