import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";

import { Note } from "./useNotes";

export const useNotesForSearch = (notes: UseQueryResult<Note[], Error>, search: string) => {
  return useQuery({
    queryKey: ["notesForSearch", notes.data, search],
    enabled: notes.data !== undefined && !!search,
    queryFn: async () => {
      console.log("running", search);

      if (!notes.data || !search) return [];

      if (search == "*") return notes.data;

      // Search by title, note and url. Prioritize if the search starts with the title. Also it should be case insensitive
      return notes.data.filter((note) => {
        const title = note.title.toLowerCase();
        const noteText = note.note.toLowerCase();
        const url = note.url.toLowerCase();

        const searchLower = search.toLowerCase();

        return title.includes(searchLower) || noteText.includes(searchLower) || url.includes(searchLower);
      });
    },
  });
};
