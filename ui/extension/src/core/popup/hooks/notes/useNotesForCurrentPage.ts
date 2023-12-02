/* eslint-disable prefer-destructuring */

import { useQuery } from "@tanstack/react-query";

import { useNotes } from "./useNotes";

async function getCurrentTab(): Promise<string | undefined> {
  return await new Promise((resolve) => {
    chrome.tabs.query({ active: true }, (tabs) => {
      const tab = tabs[0];

      resolve(tab.url);
    });
  });
}

export const useNotesForCurrentPage = () => {
  const notes = useNotes();

  return useQuery({
    queryKey: ["notesForCurrentPage", notes.data],
    enabled: notes.data !== undefined,
    queryFn: async () => {
      console.log("runnign", notes.data);

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
