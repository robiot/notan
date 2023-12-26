/* eslint-disable no-unreachable */
"use client";

import { Container } from "@/components/common/Container";
import { PageTitle } from "@/components/common/PageTitle";

import { ProductsSection } from "./_components/ProductsSection";
import { SubscriptionsSection } from "./_components/SubscriptionsSection";

export default function UpgradePage() {
  return <>Coming soon! Please wait</>;

  return (
    <Container size="xlarge" className="flex flex-col">
      <div className="mt-5">
        <PageTitle>Subscriptions</PageTitle>
        <SubscriptionsSection />
      </div>

      <div className="mt-5 mb-5">
        <PageTitle>One-time</PageTitle>
        <ProductsSection />
      </div>
      <div className="py-5" />
    </Container>
  );
}
