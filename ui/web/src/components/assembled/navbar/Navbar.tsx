"use client";

import { useEffect, useState } from "react";

import { NavigationLinks } from "@/lib/content/links";
import { cn } from "@/lib/utils";

import { Container } from "../../common/Container";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";

export const Navbar = () => {
  const [isNotTop, setIsNotTop] = useState(false);

  const handleScroll = () => {
    setIsNotTop(window.scrollY >= 10);
  };

  useEffect(() => {
    // check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 z-50 left-0 h-20 w-full transition-colors duration-300",
        isNotTop
          ? "bg-background text-foreground shadow-md"
          : "bg-transparent text-background shadow-none"
      )}
    >
      <Container className="flex items-center justify-between px-3">
        {/* <Image
          src="/notan.svg"
          alt="logo"
          width={120}
          height={20}
          className="h-5 w-auto text-primary fill-primary"
        /> */}

        <NavLink href={"/"} invert={isNotTop}>
          <Logo />
        </NavLink>

        <div className="flex gap-8 font-normal">
          {NavigationLinks.map((link) => (
            <NavLink href={link.href} key={link.href} invert={isNotTop}>
              {link.label}
            </NavLink>
          ))}
        </div>
      </Container>
    </nav>
  );
};
