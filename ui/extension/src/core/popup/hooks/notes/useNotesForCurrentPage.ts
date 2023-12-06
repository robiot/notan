/* eslint-disable prefer-destructuring */

import { useQuery } from "@tanstack/react-query";

import { getCurrentTab } from "../../lib/tabs";
import { useNotes } from "./useNotes";

export const useNotesForCurrentPage = () => {
  const notes = useNotes();

  return useQuery({
    queryKey: ["notesForCurrentPage", notes.data],
    enabled: notes.data !== undefined,
    queryFn: async () => {
      if (!notes.data) return [];

      const url = await getCurrentTab();

      if (!url) return [];

      // Ignore #ids and ignore if its http or https
      const urlWithoutHash = url.split("#")[0];
      const urlWithoutProtocol = urlWithoutHash.split("://")[1];

      return notes.data.filter((note) => {
        const noteUrlWithoutHash = note.url.split("#")[0];
        const noteUrlWithoutProtocol = noteUrlWithoutHash.split("://")[1];

        return noteUrlWithoutProtocol === urlWithoutProtocol;
      });
    },
  });
};
