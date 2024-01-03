"use client";

import { NavigationLinks } from "@/lib/content/links";

import { DownloadButton } from "./DownloadButton";
import { NavLink } from "./NavLink";

export const Dropdown = () => {
  return (
    <div className="fixed h-full w-full bg-background flex flex-col z-50 p-6 gap-16">
      <div className="flex gap-5 font-normal flex-col">
        {NavigationLinks.map((link) => (
          <NavLink href={link.href} key={link.href}>
            {link.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center w-full gap-5 flex-col">
        <DownloadButton inverted className="w-full" />
      </div>
    </div>
  );
};
