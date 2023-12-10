"use client";

import Image from "next/image";
import Link from "next/link";

import { Container } from "../../common/Container";

export const Navbar = () => {
  return (
    <div className="fixed top-0 z-50 left-0 h-20 bg-transparent w-full">
      <Container className="flex items-center justify-between px-3">
        <Image
          src="/notan.svg"
          alt="logo"
          width={120}
          height={20}
          className="h-5 w-auto text-primary fill-primary"
        />

        <div className="text-background flex gap-8">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </div>
      </Container>
    </div>
  );
};
