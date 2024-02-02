import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useActiveSearch = create(
  persist<{
    search?: string;
    set: (search: string) => void;
    clear: () => void;
  }>(
    (set) => ({
      set: (search) =>
        set(() => {
          return {
            search,
          };
        }),
      clear: () =>
        set(() => {
          return {
            search: undefined,
          };
        }),
    }),
    {
      name: "active-search",
    },
  ),
);
