export const getCurrentTab = async (): Promise<string | undefined> => {
  return await new Promise((resolve) => {
    chrome.tabs.query({ active: true }, (tabs) => {
      const [tab] = tabs;

      resolve(tab.url);
    });
  });
};
