import "@/styles/index.css";
import "@notan/components/styles/globals.css";
import "./globals.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

import { Footer } from "@/components/assembled/footer/Footer";
import { ApelEasterEgg } from "@/components/common/Apel";
import { Providers } from "@/components/common/Providers";
import { MetaDescription, MetaTitle } from "@/lib/content/meta";
import { cn } from "@/lib/utils";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const url = "https://notan.ax";

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
        <Providers>
          <ApelEasterEgg />
          {children}

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
