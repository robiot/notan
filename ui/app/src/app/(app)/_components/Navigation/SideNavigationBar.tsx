"use client";

import { Pocket } from "lucide-react";
import { FC } from "react";

// import {
//   FiArrowUpCircle,
//   FiBook,
//   FiCreditCard,
//   FiHome,
//   FiPackage,
//   FiSettings,
//   FiStar,
//   FiUsers,
// } from "react-icons/fi";
import { NavigationLink } from "./NavigationLink";

export const SideNavigationBar: FC = () => {
  return (
    <div className="bg-card h-full w-64 p-4 border-border border-r hidden md:block">
      <div className="flex flex-col gap-2">
        <NavigationLink href="/account">My Account</NavigationLink>
        <NavigationLink href="/upgrade" icon={<Pocket className="w-5" />}>
          Upgrade
        </NavigationLink>
        <NavigationLink href="/billing">Billing</NavigationLink>
      </div>
    </div>
  );
};
