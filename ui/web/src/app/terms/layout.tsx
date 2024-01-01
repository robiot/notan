import { Metadata } from "next";
import { ReactNode } from "react";

import { Navbar } from "@/components/assembled/navbar/Navbar";

export const metadata: Metadata = {
  title: "Notan | Terms of Service",
};

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
