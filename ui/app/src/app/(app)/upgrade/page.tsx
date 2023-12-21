"use client";

import { Container } from "@/components/common/Container";
import { PageTitle } from "@/components/common/PageTitle";

import { ProductsSection } from "./_components/ProductsSection";
import { SubscriptionsSection } from "./_components/SubscriptionsSection";

export default function UpgradePage() {
  return (
    <Container size="xlarge" className="flex flex-col py-16">
      <ProductsSection />

      <div className="mt-5 mb-5">
        <PageTitle>Subscriptions</PageTitle>
        <SubscriptionsSection />
      </div>
      <div className="py-5" />
    </Container>
  );
}
