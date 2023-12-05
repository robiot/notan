/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { zodResolver } from "@hookform/resolvers/zod";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "@/core/popup/components/ui/use-toast";
import { useCurrentTabInfo } from "@/core/popup/hooks/generic/useCurrentTabInfo";
import { api, ApiResponse, hasError } from "@/core/popup/lib/api";

import { NoteFormSchema, NoteFormSchemaType, NoteView } from "../_components/NoteView";

const CreateNoteContent: FC<{ values: NoteFormSchemaType }> = ({ values }) => {
  const navigate = useNavigate();

  const form = useForm<NoteFormSchemaType>({
    resolver: zodResolver(NoteFormSchema),
    defaultValues: values,
  });

  const createNote = useMutation({
    mutationKey: ["createNote"],
    mutationFn: async (data: NoteFormSchemaType) => {
      const response = await api
        .post<ApiResponse<{ token: string }>>("/notes", {
          title: data.title,
          url: data.url,
          note: data.note,
          tags: [],
          remind_at: undefined,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "max_notes")) {
            toast({
              title: "Max notes reached",
              description: "You have reached the maximum number of notes",
            });
          } else {
            toast({
              title: "Error",
              description: "An unknown error occurred while creating the note",
            });
          }
        });

      if (!response) return;

      // toast({
      //   title: "Note created",
      //   description: "The note was created successfully",
      // });

      navigate("/");
    },
  });

  return (
    <>
      <Topbar>
        <div className="flex flex-1 justify-between">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/">BACK</Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            loading={createNote.isPending}
            onClick={form.handleSubmit((data) => {
              createNote.mutate(data);
            })}>
            CREATE
          </Button>
        </div>
      </Topbar>

      <NoteView form={form} />
    </>
  );
};

export const CreateNotePage = () => {
  const tab = useCurrentTabInfo();

  if (tab.isLoading) return null;

  return (
    <CreateNoteContent
      values={{
        title: tab.data?.title ?? "",
        url: tab.data?.url ?? "",
        note: "",
      }}
    />
  );
};
