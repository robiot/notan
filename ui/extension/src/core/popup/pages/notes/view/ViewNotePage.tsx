import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@notan/components/ui/button";
import { Dialog, DialogTrigger } from "@notan/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@notan/components/ui/dropdown-menu";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { Topbar } from "@popup/components/app/Topbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MoreHorizontal } from "lucide-react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { LoadScreen } from "@/core/popup/components/app/LoadScreen";
import { UpgradeButton } from "@/core/popup/components/app/UpgradeButton";
import { api } from "@/core/popup/lib/api";

import { NoteFormSchema, NoteFormSchemaType, NoteView } from "../_components/NoteView";
import { MoreDropdown } from "./_components/MoreDropdown";
import { UnsavedChangesModal } from "./_components/UnsavedChangesModal";

const ViewNoteContent: FC<{ values: NoteFormSchemaType; id }> = ({ values, id }) => {
  const navigate = useNavigate();

  const {
    formState: { isDirty, ...formState },
    ...form
  } = useForm<NoteFormSchemaType>({
    resolver: zodResolver(NoteFormSchema),
    defaultValues: values,
  });

  const updateNote = useMutation({
    mutationKey: ["updateNote", id],
    mutationFn: async (data: NoteFormSchemaType) => {
      const response = await api
        .put<ApiResponse<{ token: string }>>(`/notes/${id}`, {
          title: data.title,
          url: data.url,
          note: data.note,
          tags: data.tags,
          remind_at: undefined,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "max_notes")) {
            toast({
              title: "Above max notes",
              description: "Upgrade for a small fee to edit your old notes",
              action: <UpgradeButton />,
            });
          } else if (hasError(error.response, "max_notes_for_domain")) {
            toast({
              title: "Above max notes for domain",
              description: `Upgrade for a small fee to edit notes for '${new URL(data.url).hostname}'`,
              action: <UpgradeButton />,
            });
          } else {
            hasError(error.response);
          }
        });

      if (!response) return;

      navigate("/");
    },
  });

  return (
    <>
      <Topbar>
        <div className="flex flex-1 justify-between">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="lg"
                onClick={(event) => {
                  if (!isDirty) {
                    event.preventDefault();
                    navigate("/");
                  }
                }}>
                BACK
              </Button>
            </DialogTrigger>

            <UnsavedChangesModal
              onSave={form.handleSubmit((data) => {
                updateNote.mutate(data);
              })}
              loading={updateNote.isPending}
            />
          </Dialog>

          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  loading={updateNote.isPending}
                  onClick={form.handleSubmit((data) => {
                    updateNote.mutate(data);
                  })}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <MoreDropdown />
            </DropdownMenu>

            <Button
              variant="ghost"
              size="lg"
              loading={updateNote.isPending}
              disabled={!isDirty}
              onClick={form.handleSubmit((data) => {
                updateNote.mutate(data);
              })}>
              SAVE
            </Button>
          </div>
        </div>
      </Topbar>

      <NoteView
        form={{
          ...form,
          formState: { isDirty, ...formState },
        }}
      />
    </>
  );
};

export const ViewNotePage = () => {
  const { id } = useParams();

  const note = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const response = await api
        .get<
          ApiResponse<{
            title: string;
            url: string;
            note: string;
            tags: string[];
            remind_at?: string;
          }>
        >(`/notes/${id}`)
        .catch((error: AxiosError) => {
          // error if generic error
          hasError(error.response);
        });

      if (!response) return;

      return response.data.data;
    },
  });

  if (note.isFetching || !note.data) return <LoadScreen loading />;

  return (
    <>
      <ViewNoteContent
        id={id}
        values={{
          title: note.data.title,
          url: note.data.url ?? undefined,
          note: note.data.note,
          tags: note.data.tags,
        }}
      />
    </>
  );
};
