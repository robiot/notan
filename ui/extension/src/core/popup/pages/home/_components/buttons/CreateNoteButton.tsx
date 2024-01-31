import { Button } from "@notan/components/ui/button";
import { Spinner } from "@notan/components/ui/spinner";
import { Plus } from "lucide-react";

import { useCreateNote } from "@/core/popup/hooks/notes/useCreateNote";

export const CreateNoteButton = () => {
  const createNote = useCreateNote();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        createNote.mutate();
      }}>
      {createNote.isPending ? <Spinner size="sm" variant="white" /> : <Plus />}
    </Button>
  );
};
