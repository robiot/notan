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
        price_annually={getPriceByPriceKey("plus_annually", prices.data)}
        title="Plus"
        alternatives={[
          {
            title: "Annualy",
            key: "plus_annually",
            period: "year",
            save_percentage: 15,
          },
          {
            title: "Monthly",
            period: "month",
            key: "plus_monthly",
          },
        ]}
        perks={SubscrtiptionPerks.plus}
      />
      <SubscriptionCard
        price={getPriceByPriceKey("pro_monthly", prices.data)}
        price_annually={getPriceByPriceKey("pro_annually", prices.data)}
        title="Pro"
        alternatives={[
          {
            title: "Annualy",
            key: "pro_annually",
            save_percentage: 15,
            period: "year",
          },
          {
            title: "Monthly",
            key: "pro_monthly",
            period: "month",
          },
        ]}
        perks={SubscrtiptionPerks.premium}
      />
    </div>
  );
};
