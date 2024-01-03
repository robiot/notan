import { Metadata } from "next";
import { ReactNode } from "react";

import { Navbar } from "@/components/assembled/navbar/Navbar";

export const metadata: Metadata = {
  title: "Notan | Contact us",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
