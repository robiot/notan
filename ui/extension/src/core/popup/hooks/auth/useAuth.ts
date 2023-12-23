import { useQuery } from "@tanstack/react-query";

import { enviroment } from "../../lib/enviroment";

const cookieName = "token";

export const getToken = () => chrome.cookies.get({ url: enviroment.APP_URL, name: cookieName });

const useToken = () => {
  return useQuery({
    queryKey: ["token"],
    retry: false,
    queryFn: async () => {
      // todo: set token to deprecatedUseOldAuth token if not set
      const token = await getToken();

      return {
        token: token.value,
      };
    },
  });
};

export const useAuth = () => {
  const token = useToken();

  const login = (new_token: string) => {
    const current = new Date();
    const expires = new Date();

    expires.setFullYear(current.getFullYear() + 10);

    // cookie should not be sent to any request
    chrome.cookies.set({
      url: enviroment.APP_URL,
      name: cookieName,
      value: new_token,
      path: "/",
      expirationDate: expires.getTime() / 1000,
    });

    token.refetch();
  };

  const logout = () => {
    chrome.cookies.remove({
      url: enviroment.APP_URL,
      name: cookieName,
    });

    token.refetch();
  };

  return {
    token: token,
    login,
    logout,
  };
};
