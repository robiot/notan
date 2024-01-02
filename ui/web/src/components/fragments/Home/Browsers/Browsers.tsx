import Ticker from "framer-motion-ticker";
import Image from "next/image";

import { Container } from "@/components/common/Container";

import { BrowserView } from "./BrowserView";
export const HomeBrowsersSection = () => {
  return (
    <section>
      <Container className="pt-32">
        <h2 className="text-base text-center mb-9 text-foreground/80">
          Supported in all modern browsers
        </h2>

        <Container className="max-w-[37rem]">
          <div className="relative">
            <div className="absolute inset-0 h-full w-9 bg-gradient-to-r from-background z-30" />

            <ul>
              <Ticker duration={22}>
                <BrowserView image="/browsers/chrome.png" name="Chrome" />
                <BrowserView image="/browsers/brave.png" name="Brave" />
                <BrowserView image="/browsers/firefox.png" name="Firefox" />
                <BrowserView image="/browsers/edge.png" name="Edge" />
                <BrowserView image="/browsers/opera.png" name="Opera GX" />
              </Ticker>
            </ul>

            <div className="absolute right-0 top-0 h-full w-9 bg-gradient-to-l from-background z-30" />
          </div>
        </Container>

        <Image
          src="/general/landing.png"
          width={2000}
          height={1000}
          className="w-full h-auto rounded-3xl border mt-10"
          alt="preview"
          loading="eager"
        />
      </Container>
    </section>
  );
};
