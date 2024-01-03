import { Container } from "@/components/common/Container";
import { HeroHeading } from "@/components/common/Hero";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Notan | Privacy Policy",
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <Container size="small" className="h-fit pt-28">
      <div className="mb-24 text-center">
        <HeroHeading>Privacy Policy</HeroHeading>
      </div>

      <div className="md-content mb-40">{children}</div>
    </Container>
  );
}
