"use client";

import { AboutBackgroundSection } from "@/components/fragments/About/Background/Background";
import { AboutCreatorSection } from "@/components/fragments/About/Creator/Creator";
import { AboutTopSection } from "@/components/fragments/About/Top/Top";

export default function About() {
  return (
    <>
      <AboutTopSection />
      <AboutBackgroundSection />
      <AboutCreatorSection />

      <div className="mb-12" />
    </>
  );
}
