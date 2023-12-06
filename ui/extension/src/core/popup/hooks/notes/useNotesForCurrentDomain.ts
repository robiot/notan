/* eslint-disable prefer-destructuring */

import { useQuery } from "@tanstack/react-query";

import { getCurrentTab } from "../../lib/tabs";
import { useNotes } from "./useNotes";
import { useNotesForCurrentPage } from "./useNotesForCurrentPage";

export const useOtherNotesForCurrentDomain = () => {
  const notes = useNotes();
  const notesForCurrentPage = useNotesForCurrentPage();

  return useQuery({
    queryKey: ["useOtherNotesForCurrentDomain", notes.data, notesForCurrentPage.data],
    enabled: notes.data !== undefined && notesForCurrentPage.data !== undefined,
    queryFn: async () => {
      if (!notes.data || !notesForCurrentPage.data) return [];

      const url = await getCurrentTab();

      if (!url) return [];

      const urlObject = new URL(url);

      return notes.data
        .filter((note) => !notesForCurrentPage.data?.some((n) => n.id === note.id))
        .filter((note) => {
          // url might not be a valid url so check that
          try {
            const noteUrlObject = new URL(note.url);

            return noteUrlObject.hostname === urlObject.hostname;
          } catch {
            return false;
          }
        });
    },
  });
};
