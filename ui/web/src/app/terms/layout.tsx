import { Container } from "@/components/common/Container";
import { HeroHeading } from "@/components/common/Hero";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Notan | Terms of Service",
};

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="small" className="h-fit pt-28">
      <div className="mb-24 text-center">
        <HeroHeading>Terms of Service</HeroHeading>
      </div>

      <div className="md-content mb-40">{children}</div>
    </Container>
  );
}
