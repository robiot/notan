import { DownloadButton } from "@/components/assembled/navbar/DownloadButton";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";

export const PricingStartWritingSection = () => {
  return (
    <section className="my-36">
      <Container
        size="small"
        className="text-center flex flex-col gap-8 items-center"
      >
        <SectionHeading>Ready to start writing?</SectionHeading>
        <p className="text-base leading-relaxed max-w-2xl">
          Sign up for free and start using Notan. You can start a subscription
          whenever you want to elevate your workflow with Notan.
        </p>

        <DownloadButton />
      </Container>
    </section>
  );
};
