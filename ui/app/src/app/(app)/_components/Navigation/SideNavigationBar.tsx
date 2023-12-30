"use client";

import { FC } from "react";

import { NavigationLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Limits } from "./Limits";
import { NavigationLink } from "./NavigationLink";

export const SideNavigationBar: FC<{
  mobile?: boolean;
  close?: () => void;
}> = ({ mobile, close }) => {
  return (
    <div
      className={cn(
        "flex-col justify-between bg-card h-full w-64 p-4 border-border border-r",
        mobile && "flex md:hidden fixed w-full h-full z-40 pt-24 gap-12",
        !mobile && "hidden md:flex"
      )}
    >
      <div className="flex flex-col gap-2">
        {NavigationLinks.map((link) => (
          <NavigationLink href={link.to} close={close} icon={link.icon}>
            {link.name}
          </NavigationLink>
        ))}
      </div>

      <Limits />
    </div>
  );
};
