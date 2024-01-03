export const getMail = () => {
  if (typeof window == "undefined") {
    return;
  }

  return decodeURIComponent(window.atob("aW5mb0Bub3R" + "hbi5heA=="));
};

export const getBillingMail = () => {
  if (typeof window == "undefined") {
    return;
  }

  return decodeURIComponent(window.atob("YmlsbGluZ0Bub3" + "Rhbi5heA=="));
};
