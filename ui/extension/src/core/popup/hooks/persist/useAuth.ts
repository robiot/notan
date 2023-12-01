import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuth = create(
  persist<{
    token?: string;
    isAuthorized: boolean;
    // expires?: number;
    login: (_: { token: string }) => void;
    logout: () => void;
  }>(
    (set) => ({
      isAuthorized: false,
      login: (data) =>
        set(() => {
          return {
            isAuthorized: true,
            token: data.token,
            // expires: data.expires,
          };
        }),
      logout: () =>
        set(() => {
          return {
            token: undefined,
            isAuthorized: false,
          };
        }),
    }),
    {
      name: "auth",
    },
  ),
);
