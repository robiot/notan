import { Metadata } from "next";
import { ReactNode } from "react";

import { Navbar } from "@/components/assembled/navbar/Navbar";

export const metadata: Metadata = {
  title: "Notan | Pricing",
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
