import "@notan/components/styles/globals.css";

import { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

import { Analytics } from "@/components/common/Analytics";
import { RootProviders } from "@/components/context/RootProviders";
import { cn } from "@/lib/utils";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

// metadata

export const metadata: Metadata = {
  title: "Notan",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("min-h-screen flex flex-col !pointer-events-auto")}
    >
      <body
        className={cn(
          noto_sans.className,
          "bg-background text-foreground flex flex-1 h-full"
        )}
      >
        <RootProviders>{children}</RootProviders>

        <Analytics />
      </body>
    </html>
  );
}
