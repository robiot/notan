import { useQuery } from "@tanstack/react-query";

export const useCurrentTabInfo = () => {
  return useQuery({
    queryKey: ["currentTabInfo"],
    queryFn: async (): Promise<{ url: string; title: string }> => {
      return await new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const [tab] = tabs;

          resolve({
            url: tab.url,
            title: tab.title,
          });
        });
      });
    },
  });
};
