import Link from "next/link";
import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const NavLink: FC<{
  href: string;
  children: ReactNode;
  invert?: boolean;
}> = ({ href, children, invert }) => {
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors duration-200",
        invert
          ? "text-foreground hover:text-foreground/80"
          : "text-background hover:text-background/70"
      )}
    >
      {children}
    </Link>
  );
};
