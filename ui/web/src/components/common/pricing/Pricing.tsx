import { SubscrtiptionPerks } from "@notan/components/lib/subscription-perks";
import { Button } from "@notan/components/ui/button";
import Link from "next/link";

import { enviroment } from "@/lib/enviroment";

import { SubscriptionCard } from "./SubscriptionCard";

export const PricingGrid = () => {
  return (
    <>
      <div className="grid lg:grid-cols-3 items-center gap-4">
        <SubscriptionCard
          title="Free"
          price="$0/month"
          perks={SubscrtiptionPerks.free}
          gradient="blue"
        >
          <Button variant="inverted" className="w-full" asChild>
            <Link href={enviroment.APP_URL + "/signup"}>Sign up</Link>
          </Button>
        </SubscriptionCard>
        <SubscriptionCard
          title="Plus"
          price="$3.99/month"
          perks={SubscrtiptionPerks.plus}
          gradient="blue"
        >
          <Button variant="inverted" className="w-full font-bold" asChild>
            <Link href={enviroment.APP_URL + "/upgrade"}>Upgrade</Link>
          </Button>
        </SubscriptionCard>
        <SubscriptionCard
          title="Premium"
          price="$9.99/month"
          perks={SubscrtiptionPerks.premium}
          gradient="purple"
        >
          <Button variant="inverted" className="w-full font-bold" asChild>
            <Link href={enviroment.APP_URL + "/upgrade"}>Upgrade</Link>
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
