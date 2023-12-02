import { useEffect, useState } from "react";

export const useCurrentTabUrl = () => {
  const [url, setUrl] = useState<string | undefined>();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;

      setUrl(tabs[0].url);
    });
  }, []);

  return url;
};
