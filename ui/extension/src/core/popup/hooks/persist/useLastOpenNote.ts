import { create } from "zustand";
import { persist } from "zustand/middleware";

import { NoteFormSchemaType } from "../../pages/notes/_components/NoteView";

export const useLastOpenNote = create(
  persist<{
    id?: string;
    data?: NoteFormSchemaType;
    update: (id: string, data?: NoteFormSchemaType) => void;
    clear: () => void;
  }>(
    (set) => ({
      update: (id, data) =>
        set(() => {
          return {
            id,
            data,
          };
        }),
      clear: () =>
        set(() => {
          return {
            id: undefined,
            data: undefined,
          };
        }),
    }),
    {
      name: "auth",
    },
  ),
);
