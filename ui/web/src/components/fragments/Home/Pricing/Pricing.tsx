import { SubscrtiptionPerks } from "@notan/components/lib/subscription-perks";
import { Button } from "@notan/components/ui/button";
import Link from "next/link";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";
import { enviroment } from "@/lib/enviroment";

import { SubscriptionCard } from "./SubscriptionCard";

export const HomePricingSection = () => {
  return (
    <section className="my-24 mt-40">
      <Container size="xlarge" className="text-center flex flex-col gap-9">
        <SectionHeading>Pricing</SectionHeading>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 items-center gap-4">
          <SubscriptionCard
            title="Free"
            price="0€/month"
            perks={SubscrtiptionPerks.free}
            gradient="blue"
          >
            <Button variant="inverted" className="w-full" asChild>
              <Link href={enviroment.APP_URL + "/signup"}>Sign up</Link>
            </Button>
          </SubscriptionCard>
          <SubscriptionCard
            title="Plus"
            price="3.99€/month"
            perks={SubscrtiptionPerks.plus}
            gradient="blue"
          >
            <Button variant="inverted" className="w-full font-bold" asChild>
              <Link href={enviroment.APP_URL + "/upgrade"}>Upgrade</Link>
            </Button>
          </SubscriptionCard>
          <SubscriptionCard
            title="Plus"
            price="8.99€/month"
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
      </Container>
    </section>
  );
};
