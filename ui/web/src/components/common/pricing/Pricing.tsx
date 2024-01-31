import { SubscrtiptionPerks } from "@notan/components/lib/subscription-perks";
import { Button } from "@notan/components/ui/button";
import Link from "next/link";

import { enviroment } from "@/lib/enviroment";
import { Switch } from "@notan/components/ui/switch";
import { SubscriptionCard } from "./SubscriptionCard";
import { useState } from "react";

export const PricingGrid = () => {
  const [isYearly, setIsYearly] = useState(false);
  return (
    <>
      <div className="flex gap-3 justify-center items-center mb-7">
        <Switch
          onCheckedChange={(checked) => {
            setIsYearly(checked);
          }}
        />
        Billed annually
        <div className="text-sm bg-primary rounded px-1">SAVE 16%</div>
      </div>
      <div className="grid lg:grid-cols-3 items-center gap-4">
        <SubscriptionCard
          title="Free"
          price={{
            amount: 0,
            period: "month",
          }}
          perks={SubscrtiptionPerks.free}
        >
          <Button className="w-full" asChild>
            <Link href={enviroment.APP_URL + "/signup"}>Sign up</Link>
          </Button>
        </SubscriptionCard>
        <SubscriptionCard
          title="Plus"
          price={{
            amount: isYearly ? 6 : 8,
            period: "month",
          }}
          popular
          perks={SubscrtiptionPerks.plus}
        >
          <Button className="w-full font-bold" asChild>
            <Link href={enviroment.APP_URL + "/?upgrade=true"}>Upgrade</Link>
          </Button>
        </SubscriptionCard>
        <SubscriptionCard
          title="Pro"
          price={{
            amount: isYearly ? 10 : 12,
            period: "month",
          }}
          perks={SubscrtiptionPerks.premium}
        >
          <Button className="w-full font-bold" asChild>
            <Link href={enviroment.APP_URL + "/?upgrade=true"}>Upgrade</Link>
          </Button>
        </SubscriptionCard>
      </div>

      <span className="text-foreground/80 text-sm">
        This data might not always be up to date. Check Upgrade for up to date
        information.
      </span>
    </>
  );
};
