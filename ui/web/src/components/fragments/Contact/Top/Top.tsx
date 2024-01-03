import { Container } from "@/components/common/Container";

export const ContactTopSection = () => {
  return (
    <Container size="small" className="h-fit pt-28">
      <div className="flex flex-col gap-9 text-left">
        <h1 className="text-3xl sm:text-5xl !leading-tight font-extrabold">
          Contact us
        </h1>
        <div className="text-lg !leading-relaxed font-normal">
          Get in touch and let us know how we can help.
        </div>
      </div>
    </Container>
  );
};
