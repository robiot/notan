import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const NavigationLink: FC<{
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  close?: () => void;
}> = ({ href, children, icon, close }) => {
  const pathname = usePathname();

  const isActive = href == "/" ? href == pathname : pathname.startsWith(href);

  return (
    <Link
      className={cn(
        "rounded w-full flex items-center p-3 gap-3 hover:bg-accent justify-between",
        isActive && "bg-accent"
      )}
      onClick={() => {
        close?.();
      }}
      href={href}
    >
      <div>{children}</div>
      {icon}
    </Link>
  );
};
