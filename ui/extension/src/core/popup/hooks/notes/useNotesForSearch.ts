import { useQuery } from "@tanstack/react-query";

import { useNotes } from "./useNotes";

export const useNotesForSearch = (search: string) => {
  const notes = useNotes();

  return useQuery({
    queryKey: ["notesForSearch", search],
    enabled: notes.data !== undefined,
    queryFn: async () => {
      if (!notes.data) return [];

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
