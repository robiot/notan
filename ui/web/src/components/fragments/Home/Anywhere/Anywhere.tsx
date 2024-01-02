import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";

import { WebpageCard } from "./WebpageCard";

export const HomeAnywhereSection = () => {
  return (
    <section className="my-24 mt-40">
      <Container size="small" className="text-left flex flex-col gap-8">
        <SectionHeading>Use Notan for any webpage</SectionHeading>
        <p className="text-base leading-relaxed">
          Notan can be used for any web page you access in your web browser.
          Make sure to pin the extension to easily access it.{" "}
          <Link
            className="text-blue-500"
            href="https://youtu.be/UXV4IbsgDpc?t=29"
          >
            How to pin an extension?
          </Link>
        </p>

        <div className="flex flex-col gap-4">
          <WebpageCard
            title="Wikipedia"
            image={
              <Image
                src={"/favicons/wikipedia-w.svg"}
                alt={"Wikipedia"}
                width={200}
                height={200}
                className="h-10 w-10"
              />
            }
          >
            Save notes for the topic you reading about.
          </WebpageCard>
          <WebpageCard
            title="Youtube"
            image={
              <Image
                src={"/favicons/youtube.png"}
                alt={"Youtube"}
                width={200}
                height={200}
                className="h-7 w-fit"
              />
            }
          >
            Use Notan to save notes for videos, or save them for watching later.
          </WebpageCard>
          <WebpageCard
            title="Every other webpage"
            image={
              <Image
                src={"/favicons/global.svg"}
                alt={"Earth"}
                width={200}
                height={200}
                className="h-10 w-fit"
              />
            }
          >
            Notan is supported on every web page you visit.
          </WebpageCard>
        </div>
      </Container>
    </section>
  );
};
