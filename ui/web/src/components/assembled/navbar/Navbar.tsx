"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { NavigationLinks } from "@/lib/content/links";
import { enviroment } from "@/lib/enviroment";
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
        <div className="flex items-center gap-8">
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
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" className="transition-none">
            <Link href={`${enviroment.APP_URL}/login`}>Log in</Link>
          </Button>
          <Button
            className={cn(!isNotTop && "bg-white hover:bg-white/80 text-black")}
            variant="secondary"
          >
            <Link href={`${enviroment.APP_URL}/signup`}>Sign up</Link>
          </Button>
        </div>
      </Container>
    </nav>
  );
};
