import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/Content";

export const AboutBackgroundSection = () => {
  return (
    <div className="py-24">
      <Container className="h-fit flex flex-col gap-5">
        <SectionHeading>Background</SectionHeading>
        <div className="flex gap-x-20 gap-y-10 flex-col md:flex-row">
          <p className="flex-1">
            The inspiration for Notan stemmed from a curiosity to learn about
            Chrome extensions. As I never had developed a real chrome extension
            before, making it was really entertaining. I combined making notan
            with a school project, where I had to create a project plan,
            reports, Gantt charts etc. I thought "Hey, why not kill two birds
            with one stone?". So Notan was like a test, but it turned out to be
            pretty useful.
          </p>
          <p className="flex-1">
            Just like my other popular projects{" "}
            <a
              href="https://github.com/robiot/xclicker"
              className="text-blue-600 hover:underline"
            >
              XClicker
            </a>
            {" and "}
            <a
              href="https://github.com/robiot/rustcat"
              className="text-blue-600 hover:underline"
            >
              Rustcat
            </a>
            , I wanted to learn something and fill a gap at the same time. With
            Notan I got the feeling that there was something missing in the way
            we take notes online, something personalized and tab-specific. So,
            there you have it, Notan: born out of curiosity, a school
            assignment, and the desire to fill a gap in the digital toolkit.
          </p>
        </div>
        <p className="mt-16">If you have an idea, go make it already!</p>
      </Container>
    </div>
  );
};
