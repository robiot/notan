export const faviconFromUrl = (url: string, size?: number) => {
  const urlObject = new URL(url);

  if (!urlObject.hostname) return;

  return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=${size ?? 128}`;
};
