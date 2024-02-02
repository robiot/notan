// cognitive complexity my ass, have fun in the future
/* eslint-disable sonarjs/cognitive-complexity */
import { useQuery } from "@tanstack/react-query";
import { UseQueryResult } from "@tanstack/react-query";

import { useTags } from "../tags/useTags";
import { Note } from "./useNotes";

// please kill me fucking shit code, most performent sorting ever seen
export const useNotesForSearch = (notes: UseQueryResult<Note[], Error>, search: string) => {
  const tags = useTags();

  return useQuery({
    queryKey: ["notesForSearch", notes.data, tags.data, search],
    enabled: notes.data !== undefined && !!search,
    queryFn: async () => {
      if (!notes.data || !search) return [];

      if (search == "page:all")
        return notes.data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      if (search == "page:latest")
        return notes.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      // Search by title, note and url. Prioritize if the search starts with the title. Also it should be case insensitive
      return notes.data.filter((note) => {
        const title = note.title.toLowerCase();
        const noteText = note.note.toLowerCase();
        const url = note.url?.toLowerCase() ?? "";

        const searchLower = search.toLowerCase();

        // get the tag
        for (const tag of note.tags) {
          const tagTitle = tags.data?.find((t) => t.id === tag)?.name.toLowerCase();

          if (tagTitle && tagTitle.includes(search.toLowerCase())) return true;
        }

        if (title.includes(searchLower)) return true;

        if (noteText.includes(searchLower)) return true;

        if (url.includes(searchLower)) return true;

        return false;
      });
    },
  });
};
