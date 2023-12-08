import { ReactNode } from "react";

import { Navbar } from "@/components/assembled/navbar/Navbar";

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}
