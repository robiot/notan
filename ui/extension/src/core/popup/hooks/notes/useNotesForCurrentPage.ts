/* eslint-disable prefer-destructuring */

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { useCurrentTabInfo } from "../generic/useCurrentTabInfo";
import { Note } from "./useNotes";

export const useNotesForCurrentPage = (notes: UseQueryResult<Note[], Error>) => {
  const tabInfo = useCurrentTabInfo();

  return useQuery({
    queryKey: ["notesForCurrentPage", notes.data, tabInfo.data?.url],
    enabled: notes.data !== undefined && tabInfo.data?.url !== undefined,
    queryFn: async () => {
      if (!notes.data || !tabInfo?.data.url) return [];

      const url = tabInfo.data?.url;

      if (!url) return [];

      // Ignore #ids and ignore if its http or https
      const urlWithoutHash = url.split("#")[0];
      const urlWithoutProtocol = urlWithoutHash.split("://")[1];

      return notes.data.filter((note) => {
        if (!note.url) return false;

        const noteUrlWithoutHash = note.url.split("#")[0];
        const noteUrlWithoutProtocol = noteUrlWithoutHash.split("://")[1];

        return noteUrlWithoutProtocol === urlWithoutProtocol;
      });
    },
  });
};
