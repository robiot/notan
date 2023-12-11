import { Container } from "@/components/common/Container";
import { Hero, HeroHeading } from "@/components/common/Hero";

export const AboutTopSection = () => {
  return (
    <Hero className="h-[30rem] bg-purple-blue-gradient flex justify-center">
      <Container size="small" className="h-fit text-center">
        <HeroHeading>About Notan</HeroHeading>
      </Container>
    </Hero>
  );
};
