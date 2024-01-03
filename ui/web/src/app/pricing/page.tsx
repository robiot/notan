"use client";

import { PricingOptionsSection } from "@/components/fragments/Pricing/Options/Options";
import { PricingStartWritingSection } from "@/components/fragments/Pricing/StartWriting/StartWriting";
import { PricingTopSection } from "@/components/fragments/Pricing/Top/Top";

export default function Pricing() {
  return (
    <>
      <PricingTopSection />

      <PricingOptionsSection />
      <PricingStartWritingSection />
      {/* <ContactOptionsSection /> */}
    </>
  );
}
