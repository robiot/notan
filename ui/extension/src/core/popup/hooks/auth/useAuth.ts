/* eslint-disable unicorn/consistent-function-scoping */
import { useEffect, useState } from "react";

import { enviroment } from "../../lib/enviroment";
import { deprecadedUseOldAuth } from "./deprecatedUseOldAuth";

const cookieName = "token";

export const getTokenCookie = () => chrome.cookies.get({ url: enviroment.APP_URL, name: cookieName });

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
  const oldAuth = deprecadedUseOldAuth();

  useEffect(() => {
    (async () => {
      const token = await getTokenCookie();
      const oldToken = oldAuth?.token;

      if (!token && oldToken !== undefined) {
        setTokenCookie(oldToken);
        // remove old token
        oldAuth.logout();
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
