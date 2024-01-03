/* eslint-disable sonarjs/no-duplicate-string */
import { Button } from "@notan/components/ui/button";
import { detect } from "detect-browser";
import { Download } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export const DownloadButton: FC<{
  size?: "small" | "normal";
  className?: string;
  inverted?: boolean;
}> = ({ size, className, inverted }) => {
  const [_browser, setBrowser] = useState<string | null>("your browser");
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    const browser = detect();

    if (!browser?.name) return;

    const chromeUrl =
      "https://chromewebstore.google.com/detail/notan/hbjpkligkpghgjacpmfoccjjijkmngkg";

    const firefoxUrl =
      "https://addons.mozilla.org/en-US/firefox/addon/notan/?utm_source=notan.ax";

    switch (browser && browser.name) {
      case "chrome":
        if ((navigator as any)?.brave) {
          setBrowser("Brave");
        } else {
          setBrowser("Chrome");
        }

        setLink(chromeUrl);
        break;
      case "firefox":
        setBrowser("Firefox");
        setLink(firefoxUrl);
        break;
      case "edge":
        setBrowser("Edge");
        setLink(chromeUrl);
        break;
      case "opera":
        setBrowser("Opera");
        setLink(chromeUrl);
        break;
      default:
        setBrowser("your browser");
        setLink(chromeUrl);
    }
  }, []);

  return (
    <Button
      className={cn(
        "w-fit gap-1 h-11 rounded-md",
        size == "small" ? "h-9" : "h-12",
        className
      )}
      variant={inverted ? "inverted" : undefined}
      asChild
    >
      <Link
        href={link ?? ""}
        target="_blank"
        onClick={(event) => {
          if (link == null) {
            alert(
              "We are waiting for Chrome Web Store to approve our extension. Please check back later."
            );
            event.preventDefault();
          }
        }}
      >
        {size !== "small" && <Download className="w-4 mr-2" />}
        Add to {_browser}
      </Link>
    </Button>
  );
};
