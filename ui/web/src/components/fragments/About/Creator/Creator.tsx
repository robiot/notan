import Link from "next/link";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";

export const AboutCreatorSection = () => {
  return (
    <div className="py-24">
      <Container className="h-fit flex flex-col gap-5">
        <SectionHeading>Creator</SectionHeading>
        <p className="flex-1">
          Hello 👋, I'm Elliot and I'm the creator of Notan. You can see{" "}
          <Link
            className="text-blue-500"
            href="https://robiot.dev"
            target="_blank"
          >
            my webpage
          </Link>{" "}
          for more information.
        </p>
      </Container>
    </div>
  );
};
