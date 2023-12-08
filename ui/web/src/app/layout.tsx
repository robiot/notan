import "./globals.css";
import "@/styles/index.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const noto_sans = Noto_Sans({ subsets: ["latin"] });

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
      </body>
    </html>
  );
}
