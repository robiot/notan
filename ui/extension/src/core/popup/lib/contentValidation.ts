export const getValidTabTitle = (title?: string) => {
  if (!title) return "";

  if (title.length > 250) {
    // strip to 250 chars
    return title.slice(0, 250);
  }

  return title;
};

export const getValidTabUrl = (url?: string) => {
  if (!url) return "";

  if (url.length > 250) {
    // remove query params
    const urlObject = new URL(url);

    urlObject.search = "";

    return urlObject.toString();
  }

  return url;
};
