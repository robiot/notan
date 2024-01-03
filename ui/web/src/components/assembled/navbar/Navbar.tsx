"use client";

import { Button } from "@notan/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { NavigationLinks } from "@/lib/content/links";
import { enviroment } from "@/lib/enviroment";
import { cn } from "@/lib/utils";

import { Container } from "../../common/Container";
import { DownloadButton } from "./DownloadButton";
import { Dropdown } from "./Dropdown";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";

export const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <nav
        className={cn(
          "h-16 w-full transition-colors duration-300",
          "text-foreground",
          dropdownOpen && "z-50 bg-background sticky top-0"
        )}
      >
        <Container className="flex items-center justify-between px-3">
          <div className="flex items-center gap-8">
            <NavLink href={"/"}>
              <div className="flex items-center gap-4">
                <Image
                  src="/notan-mini.png"
                  width={100}
                  height={100}
                  alt="notan logo"
                  className="w-9 h-9"
                />
                <Logo />
              </div>
            </NavLink>

            <div className="gap-5 font-normal hidden md:flex">
              {NavigationLinks.map((link) => (
                <NavLink href={link.href} key={link.href}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link href={`${enviroment.APP_URL}/login`} className="">
              Log in
            </Link>

            <div className="hidden md:block">
              <DownloadButton
                size="small"
                className="bg-foreground text-background hover:bg-foreground/80"
              />
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
              }}
            >
              {dropdownOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </Container>
      </nav>

      {dropdownOpen && <Dropdown />}
    </>
  );
};
