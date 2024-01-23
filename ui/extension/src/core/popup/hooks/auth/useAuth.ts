/* eslint-disable unicorn/consistent-function-scoping */
import { useEffect, useState } from "react";

import { enviroment } from "../../lib/enviroment";

const cookieName = "token";

// export const getTokenCookie = () => chrome.cookies.get({ url: enviroment.APP_URL, name: cookieName });

export const getTokenCookie = async () => {
  return new Promise<chrome.cookies.Cookie | undefined>((resolve) => {
    chrome.cookies.get({ url: enviroment.APP_URL, name: cookieName }, (cookie) => {
      resolve(cookie);
    });
  });
};

export const getOldDomainTokenCookie = async () => {
  return new Promise<chrome.cookies.Cookie | undefined>((resolve) => {
    chrome.cookies.get({ url: "https://app.notan.ax", name: cookieName }, (cookie) => {
      resolve(cookie);
    });
  });
};

const setTokenCookie = (token: string) => {
  const current = new Date();
  const expires = new Date();

  expires.setFullYear(current.getFullYear() + 10);

  // cookie should not be sent to any request
  chrome.cookies.set({
    url: enviroment.APP_URL,
    name: cookieName,
    value: token,
    path: "/",
    expirationDate: expires.getTime() / 1000,
  });
};

const useToken = () => {
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    (async () => {
      const token = await getTokenCookie();
      const oldToken = await getOldDomainTokenCookie();

      if (!token && oldToken !== null) {
        setTokenCookie(oldToken.value);
      } else if (token?.value) {
        setTokenCookie(token.value);
      }
    })();

    const onCookieChanged = (changeInfo: chrome.cookies.CookieChangeInfo) => {
      if (changeInfo.cookie.name === cookieName) {
        setToken(changeInfo.cookie.value);
      }
    };

    chrome.cookies.onChanged.addListener(onCookieChanged);

    return () => {
      chrome.cookies.onChanged.removeListener(onCookieChanged);
    };
  }, []);

  return token;
};

export const useAuth = () => {
  const token = useToken();

  const login = (new_token: string) => {
    setTokenCookie(new_token);
  };

  const logout = () => {
    chrome.cookies.remove({
      url: enviroment.APP_URL,
      name: cookieName,
    });
  };

  return {
    token: token,
    login,
    logout,
  };
};
