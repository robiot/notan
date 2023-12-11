import "./globals.css";
import "@/styles/index.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

import { Footer } from "@/components/assembled/footer/Footer";
import { cn } from "@/lib/utils";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Notan",
  description: "The browser extension for seamless, page-specific note-taking.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(noto_sans.className, "bg-background text-foreground")}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
