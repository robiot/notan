import Link from "next/link";
import { FC } from "react";

export const FooterCategory: FC<{
  title: string;
  links: {
    href: string;
    label: string;
    external?: boolean;
  }[];
}> = ({ title, links }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold mb-2">{title}</span>
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          className="text-foreground hover:text-foreground/80 transition-colors duration-200"
          target={link.external ? "_blank" : ""}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};
