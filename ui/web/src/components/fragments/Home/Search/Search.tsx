import Image from "next/image";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";

export const HomeSearchSection = () => {
  return (
    <section className="my-24 mt-40">
      <Container
        size="small"
        className="text-center flex flex-col gap-8 items-center"
      >
        <SectionHeading>Search notes</SectionHeading>
        <p className="text-base leading-relaxed">
          The search field is a powerful tool located in the top. With it you
          can search notes by Title, Note content, domain, or use * to show all
          your notes.
        </p>

        <div className="grid grid-cols-3 gap-8 mt-9">
          <Image
            src="/general/square/1.png"
            width={1000}
            height={1000}
            className="rounded-3xl border"
            alt="preview"
          />
          <Image
            src="/general/square/2.png"
            width={500}
            height={500}
            className="rounded-3xl border"
            alt="preview"
          />
          <Image
            src="/general/square/3.png"
            width={1000}
            height={1000}
            className="rounded-3xl border"
            alt="preview"
          />
        </div>

        <span className="w-fit border-l-2 px-5 border-l-green-400 text-foreground/80">
          Useful Tip: Drag notes into the search field to open their connected
          link.
        </span>
      </Container>
    </section>
  );
};
