import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";
import { PricingGrid } from "@/components/common/pricing/Pricing";

export const HomePricingSection = () => {
  return (
    <section className="my-24 mt-40">
      <Container size="xlarge" className="text-center flex flex-col gap-9">
        <SectionHeading>Pricing</SectionHeading>

        <PricingGrid />
      </Container>
    </section>
  );
};
