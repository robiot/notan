/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@notan/components/ui/button";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { Topbar } from "@popup/components/app/Topbar";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link2, Link2Off } from "lucide-react";
import { FC } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { UpgradeButton } from "@/core/popup/components/app/UpgradeButton";
import { useCurrentTabInfo } from "@/core/popup/hooks/generic/useCurrentTabInfo";
import { api } from "@/core/popup/lib/api";
import { getValidTabTitle, getValidTabUrl } from "@/core/popup/lib/contentValidation";

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
          tags: data.tags,
          remind_at: undefined,
        })
        .catch((error: AxiosError) => {
          if (hasError(error.response, "max_notes")) {
            toast({
              title: "Max notes reached",
              description: "Upgrade for a small fee to create more notes",
              action: <UpgradeButton />,
            });
          } else if (hasError(error.response, "max_notes_for_domain")) {
            toast({
              title: "Max notes for domain reached",
              description: `Upgrade for a small fee to create more notes for '${new URL(data.url).hostname}'`,
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

      navigate("/");
    },
  });

  useEffect(() => {
    form.setFocus("note");
  }, []);

  return (
    <>
      <Topbar>
        <div className="flex flex-1 justify-between">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/">BACK</Link>
          </Button>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                console.log(form.getValues("url"));

                if (form.getValues("url") == undefined) {
                  form.setValue("title", values.title);
                  form.setValue("url", values.url);
                } else {
                  // eslint-disable-next-line unicorn/no-useless-undefined
                  form.setValue("url", undefined);
                  form.setValue("title", "");
                }
              }}>
              {form.watch("url") !== undefined ? <Link2Off className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
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
        title: getValidTabTitle(tab.data?.title),
        url: getValidTabUrl(tab.data?.url),
        note: "",
        tags: [],
      }}
    />
  );
};
