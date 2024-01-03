import { DownloadButton } from "@/components/assembled/navbar/DownloadButton";
import { Navbar } from "@/components/assembled/navbar/Navbar";
import { Container } from "@/components/common/Container";
import { HeroHeading, HeroSubHeading } from "@/components/common/Hero";

import { CheckItem } from "./CheckItem";

export const HomeTopSection = () => {
  return (
    <>
      <Navbar />

      <Container size="small" className="h-fit pt-28 text-center">
        <div className="flex flex-col gap-9 items-center">
          <HeroHeading>
            Take notes for your{" "}
            <span className="text-primary">current page</span> without leaving
            the browser
          </HeroHeading>
          <HeroSubHeading>
            Use this browser extension for saving notes for web pages instead of
            saving them somewhere that you will forget about.
          </HeroSubHeading>

          <DownloadButton className="px-5" />

          <div className="flex flex-col md:flex-row items-center gap-5 gap-y-10 mt-6 md:mt-0">
            <CheckItem>No credit card required</CheckItem>
            <CheckItem>Free plan by default</CheckItem>
          </div>
        </div>
      </Container>
    </>
  );
};
