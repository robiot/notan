"use client";

import Image from "next/image";

import { Container } from "../../common/Container";
import { DownloadButton } from "./DownloadButton";

export const Navbar = () => {
  return (
    <div className="sticky top-0 left-0 h-20 bg-background border-b border-b-border w-full ">
      <Container className="flex items-center">
        <Image
          src="/notan.svg"
          alt="logo"
          width={120}
          height={20}
          className="h-5 w-auto text-primary fill-primary"
        />
        <DownloadButton />
      </Container>
    </div>
  );
};
