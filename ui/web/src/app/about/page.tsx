"use client";

import { AboutBackgroundSection } from "@/components/fragments/About/Background/Background";
import { AboutTopSection } from "@/components/fragments/About/Top/Top";

export default function About() {
  return (
    <>
      <AboutTopSection />
      <AboutBackgroundSection />

      <div className="mb-52"></div>
    </>
  );
}
