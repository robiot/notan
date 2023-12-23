import { create } from "zustand";
import { persist } from "zustand/middleware";

export const deprecadedUseOldAuth = create(
  persist<{
    token?: string;
    isAuthorized: boolean;
    logout: () => void;
  }>(
    (set) => ({
      isAuthorized: false,
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
