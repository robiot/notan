import { FC } from "react";

import { Container } from "@/components/common/Container";
import { LegalLinks, NavigationLinks } from "@/lib/content/links";

import { Logo } from "../navbar/Logo";
import { FooterCategory } from "./Category";

export const Footer: FC = () => {
  return (
    <footer className="w-full border-t border-t-border py-24">
      <Container className="flex h-fit flex-col">
        <div className="flex justify-between flex-col items-center text-center md:items-start md:text-start md:flex-row gap-y-10">
          <div className="text-foreground">
            <Logo />
          </div>

          <div className="flex gap-12 flex-col items-center text-center md:items-start md:text-start md:flex-row">
            <FooterCategory title="Pages" links={NavigationLinks} />
            <FooterCategory title="Legal" links={LegalLinks} />
          </div>
        </div>

        <div className="mt-24 text-center md:text-start">
          Copyright © {new Date().getFullYear()} Robiot. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};
