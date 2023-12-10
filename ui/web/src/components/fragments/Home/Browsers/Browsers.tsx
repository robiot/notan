import { Container } from "@/components/common/Container";

import { BrowserView } from "./BrowserView";

export const HomeBrowsersSection = () => {
  return (
    <Container className="border-x border-x-border/30 pt-48 pb-24">
      <h2 className="font-bold text-2xl text-center">
        Supported in all modern browsers
      </h2>

      <div className="mt-6 flex flex-wrap gap-14 justify-center">
        <BrowserView image="/browsers/chrome.png" name="Chrome" />
        <BrowserView image="/browsers/brave.png" name="Brave" />
        <BrowserView image="/browsers/firefox.png" name="Firefox" />
        <BrowserView image="/browsers/edge.png" name="Edge" />
        <BrowserView image="/browsers/opera.png" name="Opera GX" />
      </div>
    </Container>
  );
};
