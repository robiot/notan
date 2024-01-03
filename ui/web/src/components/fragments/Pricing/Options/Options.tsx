import { Container } from "@/components/common/Container";
import { PricingGrid } from "@/components/common/pricing/Pricing";

export const PricingOptionsSection = () => {
  return (
    <section className="my-24">
      <Container size="xlarge" className="text-center flex flex-col gap-9">
        <PricingGrid />
      </Container>
    </section>
  );
};
