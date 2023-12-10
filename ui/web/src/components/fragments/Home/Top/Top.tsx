import Image from "next/image";

import { DownloadButton } from "@/components/assembled/navbar/DownloadButton";
import { Container } from "@/components/common/Container";
import { Hero, HeroHeading, HeroSubHeading } from "@/components/common/Hero";

export const HomeTopSection = () => {
  return (
    <Hero>
      <Container
        noPadding
        className="relative border-x border-l-border/60 border-r-white/10"
      >
        <Container
          size="small"
          className="pointer-events-none left-1/2 -translate-x-1/2 absolute h-full border-x border-l-border/60 border-r-white/10"
        />

        <Container size="small" className="h-fit pt-36 text-center">
          <HeroHeading>Seamless note taking for your current page</HeroHeading>
          <HeroSubHeading>
            The browser extension for seamless, page-specific note-taking.
          </HeroSubHeading>

          <div className="mt-7">
            <DownloadButton />
          </div>
        </Container>

        <div className="overflow-x-hidden relative z-10 flex justify-center items-center gap-7 mt-32 sm:mt-16">
          <Image
            src="/preview/create2.png"
            alt="create"
            className="h-40 sm:h-80 w-auto rounded-sm border-border border"
            width={380}
            height={600}
          />
          <Image
            src="/preview/create.png"
            alt="create"
            className="h-56 sm:h-96 w-auto rounded-sm border-border border"
            width={380}
            height={600}
            loading="eager"
          />
          <Image
            src="/preview/list.png"
            alt="create"
            className="h-40 sm:h-80 w-auto rounded-sm border-border border"
            width={380}
            height={600}
          />
        </div>
      </Container>
    </Hero>
  );
};
