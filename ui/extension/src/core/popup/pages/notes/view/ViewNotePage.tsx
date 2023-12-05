import { zodResolver } from "@hookform/resolvers/zod";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/core/popup/components/ui/dialog";
import { api, ApiResponse, hasError } from "@/core/popup/lib/api";

import { NoteFormSchema, NoteFormSchemaType, NoteView } from "../_components/NoteView";

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

      // toast({
      //   title: "Note updated",
      //   description: "The note was updated successfully",
      // });

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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>You are exiting with unsaved changes</DialogTitle>
                <DialogDescription>Do you wish to save?</DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-row w-full items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-32"
                  onClick={() => {
                    navigate("/");
                  }}>
                  DISCARD
                </Button>
                <Button
                  variant="default"
                  size="lg"
                  className="w-32"
                  loading={updateNote.isPending}
                  onClick={form.handleSubmit((data) => {
                    updateNote.mutate(data);
                  })}>
                  SAVE
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="lg"
            loading={updateNote.isPending}
            onClick={form.handleSubmit((data) => {
              updateNote.mutate(data);
            })}>
            SAVE
          </Button>
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

  if (note.isLoading || !note.data) return null;

  return (
    <ViewNoteContent
      id={id}
      values={{
        title: note.data.title,
        url: note.data.url,
        note: note.data.note,
      }}
    />
  );
};
