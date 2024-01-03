import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@notan/components/ui/accordion";

import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";
import { FAQ } from "@/lib/content/meta";
export const HomeFaqSection = () => {
  return (
    <section className="my-24 mt-40">
      <Container size="small" className="text-center flex flex-col gap-8">
        <SectionHeading>Frequently Asked Questions</SectionHeading>

        <Accordion type="single" collapsible className="text-left">
          {FAQ.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};
