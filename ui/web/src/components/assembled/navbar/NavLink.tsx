import Link from "next/link";
import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const NavLink: FC<{
  href: string;
  children: ReactNode;
}> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors duration-200 font-normal",
        "text-foreground hover:text-foreground/80"
      )}
    >
      {children}
    </Link>
  );
};
