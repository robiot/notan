"use client";

import { Pocket } from "lucide-react";
import { FC } from "react";

import { Limits } from "./Limits";
import { NavigationLink } from "./NavigationLink";

export const SideNavigationBar: FC = () => {
  return (
    <div className="flex-col justify-between bg-card h-full w-64 p-4 border-border border-r hidden md:flex">
      <div className="flex flex-col gap-2">
        <NavigationLink href="/account">My Account</NavigationLink>
        <NavigationLink href="/upgrade" icon={<Pocket className="w-5" />}>
          Upgrade
        </NavigationLink>
        <NavigationLink href="/billing">Billing</NavigationLink>
      </div>

      <Limits />
    </div>
  );
};
