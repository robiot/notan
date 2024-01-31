import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@notan/components/ui/button";
import { Dialog, DialogTrigger } from "@notan/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger } from "@notan/components/ui/dropdown-menu";
import { Spinner } from "@notan/components/ui/spinner";
import { toast } from "@notan/components/ui/use-toast";
import { ApiResponse, hasError } from "@notan/utils/api";
import { Topbar } from "@popup/components/app/Topbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link2, Link2Off, MoreHorizontal } from "lucide-react";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { UpgradeButton } from "@/core/popup/components/app/UpgradeButton";
import { useLastOpenNote } from "@/core/popup/hooks/persist/useLastOpenNote";
import { api } from "@/core/popup/lib/api";

import { NoteFormSchema, NoteFormSchemaType, NoteView } from "../_components/NoteView";
import { MoreDropdown } from "./_components/MoreDropdown";
import { UnsavedChangesModal } from "./_components/UnsavedChangesModal";

const ViewNoteContent: FC<{
  values: NoteFormSchemaType;
  id: string;

  defaultDirty: boolean;
}> = ({ values, id, defaultDirty }) => {
  const navigate = useNavigate();
  const lastOpenNote = useLastOpenNote();

  const {
    formState: { isDirty, ...formState },
    ...form
  } = useForm<NoteFormSchemaType>({
    resolver: zodResolver(NoteFormSchema),

    defaultValues: values,
  });

  const isReallyDirty = isDirty || defaultDirty;

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

      // remove data, since it is saved
      lastOpenNote.update(lastOpenNote.id);
      form.reset(data);
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
                  if (!isReallyDirty) {
                    event.preventDefault();

                    lastOpenNote.clear();
                    navigate("/");
                  }
                }}>
                BACK
              </Button>
            </DialogTrigger>

            <UnsavedChangesModal
              onSave={form.handleSubmit((data) => {
                lastOpenNote.clear();
                updateNote.mutate(data);

                navigate("/");
              })}
              loading={updateNote.isPending}
            />
          </Dialog>

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <MoreDropdown />
            </DropdownMenu>

            <Button
              variant="ghost"
              size="lg"
              loading={updateNote.isPending}
              disabled={!isReallyDirty}
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
  const navigate = useNavigate();
  const lastOpenNote = useLastOpenNote();

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
          if (hasError(error.response, "not_found")) {
            lastOpenNote.clear();
            navigate("/");
          } else {
            toast({
              title: "Error",
              description: "An unknown error occurred while fetching the note",
            });
          }
        });

      if (!response) return;

      return response.data.data;
    },
  });

  if (lastOpenNote.data == undefined && (note.isFetching || !note.data))
    return (
      <div className="flex flex-col items-center">
        <Topbar />
        <Spinner size="sm" className=" mt-3" />
      </div>
    );

  return (
    <>
      <ViewNoteContent
        id={id}
        defaultDirty={lastOpenNote.data !== undefined}
        values={
          lastOpenNote.data ?? {
            title: note.data.title,
            url: note.data.url ?? undefined,
            note: note.data.note,
            tags: note.data.tags,
          }
        }
      />
    </>
  );
};
