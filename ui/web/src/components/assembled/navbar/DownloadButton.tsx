/* eslint-disable sonarjs/no-duplicate-string */
import { detect } from "detect-browser";
import { Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export const DownloadButton = () => {
  const [_browser, setBrowser] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    const browser = detect();

    if (!browser?.name) return;

    switch (browser && browser.name) {
      case "chrome":
        setBrowser("Chrome");
        setLink("https://og.ax");
        break;
      case "firefox":
        setBrowser("Firefox");
        setLink("https://og.ax");
        break;

      case "edge":
        setBrowser("Edge");
        setLink("https://og.ax");
        break;

      default:
        setBrowser("your browser");
    }
  }, []);

  return (
    <Button className="ml-auto" asChild>
      <Link href={link ?? ""}>
        <Download className="w-4 mr-2" />
        Add to your browser
      </Link>
    </Button>
  );
};
