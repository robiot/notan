import "@/styles/index.css";
import "@notan/components/styles/globals.css";
import "./globals.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

import { Footer } from "@/components/assembled/footer/Footer";
import { Navbar } from "@/components/assembled/navbar/Navbar";
import { Analytics } from "@/components/common/Analytics";
import { ApelEasterEgg } from "@/components/common/Apel";
import { MetaDescription, MetaTitle } from "@/lib/content/meta";
import { cn } from "@/lib/utils";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const url = "https://getnotan.com";

export const metadata: Metadata = {
  title: MetaTitle,
  description: MetaDescription,

  metadataBase: new URL(url),
  openGraph: {
    url: url,
    images: [
      {
        url: "/og/og-image.png",
        width: 1406,
        height: 803,
        alt: "Notan",
        type: "image/png",
      },
    ],
    siteName: "Notan",
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(noto_sans.className, "bg-background text-foreground")}
      >
        <Navbar />

        <ApelEasterEgg />
        {children}

        <Footer />

        <Analytics />
      </body>
    </html>
  );
}
