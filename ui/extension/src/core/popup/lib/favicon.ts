export const faviconFromUrl = (url: string, size?: number) => {
  // make it work even tho url might be missing protocol
  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }

  let urlObject: URL;

  try {
    urlObject = new URL(url);
  } catch {
    return;
  }

  if (!urlObject.hostname) return;

  return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=${size ?? 128}`;
};
