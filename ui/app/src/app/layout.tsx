import "./globals.css";

import { Noto_Sans } from "next/font/google";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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
