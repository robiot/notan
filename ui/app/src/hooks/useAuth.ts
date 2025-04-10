// useAuth hook which returns the cookie token and, a login and logout function

import { useCookies } from "react-cookie";

export const getCookie = (name: string) => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");

    if (cookieName.trim() === name) {
      return cookieValue;
    }
  }
};

export const useAuth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const login = (token: string) => {
    const current = new Date();
    const expires = new Date();

    expires.setFullYear(current.getFullYear() + 10);

    // cookie should not be sent to any request
    setCookie("token", token, {
      path: "/",
      expires,
    });
  };

  const logout = () => {
    removeCookie("token", {
      path: "/",
    });
  };

  return {
    token: cookies.token as string | undefined,
    login,
    logout,
  };
};
