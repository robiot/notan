import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Notan | Pricing",
};

export default function PricingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
