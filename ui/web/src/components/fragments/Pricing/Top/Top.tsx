import { Star } from "lucide-react";
import Image from "next/image";

import { Container } from "@/components/common/Container";
import { HeroSubHeading } from "@/components/common/Hero";

const StarIcon = () => {
  return <Star className="text-yellow-100 h-5 w-5 fill-yellow-100" />;
};

export const PricingTopSection = () => {
  return (
    <Container size="small" className="h-fit pt-28">
      <div className="flex flex-col gap-9 text-center items-center">
        <h1 className="text-3xl sm:text-5xl !leading-tight font-extrabold">
          Pricing
        </h1>
        <HeroSubHeading>
          Subscribe to unlock more notes and note length.
        </HeroSubHeading>

        <div className="flex flex-col gap-2 items-center">
          <div className="flex gap-1">
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
            <StarIcon />
          </div>
          <span className="flex items-center gap-2">
            <Image
              src="/browsers/chrome.png"
              alt="Chrome"
              width={20}
              height={20}
              className="grayscale"
            />
            5 star rating
          </span>
        </div>
      </div>
    </Container>
  );
};
