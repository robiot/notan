"use client";

import { Container } from "@/components/common/Container";

import { ProductsSection } from "./_components/ProductsSection";

export default function UpgradePage() {
  return (
    <Container size="xlarge" className="flex flex-col py-16">
      <ProductsSection />
    </Container>
  );
}
