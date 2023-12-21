import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const NavigationLink: FC<{
  href: string;
  children: ReactNode;
}> = ({ href, children }) => {
  const pathname = usePathname();

  const isActive = href == "/" ? href == pathname : pathname.startsWith(href);

  return (
    <Link
      className={cn(
        "rounded w-full flex items-center p-3 gap-3 hover:accent",
        isActive && "bg-accent"
      )}
      href={href}
    >
      <div>{children}</div>
    </Link>
  );
};
