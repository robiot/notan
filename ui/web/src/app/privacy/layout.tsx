import { Metadata } from "next";
import { ReactNode } from "react";

import { Navbar } from "@/components/assembled/navbar/Navbar";

export const metadata: Metadata = {
  title: "Notan | Privacy Policy",
};

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
