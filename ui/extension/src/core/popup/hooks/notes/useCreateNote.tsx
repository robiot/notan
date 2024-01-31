import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { UpgradeButton } from "@/core/popup/components/app/UpgradeButton";
import { useCurrentTabInfo } from "@/core/popup/hooks/generic/useCurrentTabInfo";
import { useLastOpenNote } from "@/core/popup/hooks/persist/useLastOpenNote";
import { api } from "@/core/popup/lib/api";
import { getValidTabTitle, getValidTabUrl } from "@/core/popup/lib/contentValidation";

export const useCreateNote = () => {
  const navigate = useNavigate();
  const tab = useCurrentTabInfo();
  const lastOpenNote = useLastOpenNote();

  return useMutation({
    mutationKey: ["createNote", tab.data],
    mutationFn: async () => {
      const response = await api
        .post<ApiResponse<{ id: string }>>("/notes", {
          title: getValidTabTitle(tab.data?.title),
          url: getValidTabUrl(tab.data?.url),
          note: "",
          tags: [],
          remind_at: undefined,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "max_notes")) {
            toast({
              title: "Max notes reached",
              description: "Upgrade for a small fee to create more notes",
              action: <UpgradeButton />,
            });
          } else {
            toast({
              title: "Error",
              description: "An unknown error occurred while creating the note",
            });
          }
        });

      if (!response) return;

      lastOpenNote.update(response.data.data.id);
      navigate(`/notes/view/${response.data.data.id}`);
    },
  });
};
