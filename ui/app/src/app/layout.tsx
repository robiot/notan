import "@notan/components/styles/globals.css";

import { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

import { LoginContext } from "@/components/context/LoginContext";
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
    <html lang="en" className={cn("min-h-screen flex flex-col")}>
      <body
        className={cn(
          noto_sans.className,
          "bg-background text-foreground flex flex-1 h-full"
        )}
      >
        <RootProviders>
          <LoginContext>{children}</LoginContext>
        </RootProviders>
      </body>
    </html>
  );
}
