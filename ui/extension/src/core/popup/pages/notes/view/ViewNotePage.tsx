import { zodResolver } from "@hookform/resolvers/zod";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MoreHorizontal } from "lucide-react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { Dialog, DialogTrigger } from "@/core/popup/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@/core/popup/components/ui/dropdown-menu";
import { api, ApiResponse, hasError } from "@/core/popup/lib/api";

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
          tags: [],
          remind_at: undefined,
        })
        .catch((error: AxiosError) => {
          hasError(error.response);
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

  if (note.isFetching || !note.data) return null;

  return (
    <>
      <ViewNoteContent
        id={id}
        values={{
          title: note.data.title,
          url: note.data.url,
          note: note.data.note,
        }}
      />
    </>
  );
};
