import { DropdownMenuItem } from "@notan/components/ui/dropdown-menu";
import { Spinner } from "@notan/components/ui/spinner";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";

import { UpgradeButton } from "@/core/popup/components/app/UpgradeButton";
import { Tag } from "@/core/popup/hooks/tags/useTags";
import { api } from "@/core/popup/lib/api";
import { cn } from "@/core/popup/lib/utils";

import { Color } from "../TagView";

export const ColorItem: FC<{ refetch: () => Promise<void>; color: Color; tag: Tag }> = ({
  refetch,
  color: colorData,
  tag,
}) => {
  const [colorKey, color] = colorData;

  const updateTag = useMutation({
    mutationKey: ["updateTag", colorKey],
    mutationFn: async (color: string) => {
      const response = await api
        .patch<ApiResponse<unknown>>(`/tags/${tag.id}`, {
          color,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "max_tags")) {
            toast({
              title: "Max tags reached",
              description: "Upgrade to edit your tags",
              action: <UpgradeButton />,
            });
          } else {
            toast({
              title: "Error",
              description: "Something went wrong",
            });
          }
        });

      if (!response) return;

      await refetch();
    },
  });

  return (
    <DropdownMenuItem
      className="flex gap-3"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        updateTag.mutate(colorKey);
      }}>
      {updateTag.isPending ? (
        <Spinner className="w-3 h-3" />
      ) : (
        <>
          <div className={cn("w-3 h-3 rounded-full", color.style)} />
        </>
      )}
      {color.name}
    </DropdownMenuItem>
  );
};
