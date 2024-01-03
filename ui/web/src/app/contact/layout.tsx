import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Notan | Contact us",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
