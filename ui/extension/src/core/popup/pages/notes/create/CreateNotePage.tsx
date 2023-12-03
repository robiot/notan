/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { zodResolver } from "@hookform/resolvers/zod";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { NoteFormSchema, NoteFormSchemaType, NoteView } from "../_components/NoteView";

export const CreateNotePage = () => {
  const form = useForm<NoteFormSchemaType>({
    resolver: zodResolver(NoteFormSchema),
    defaultValues: {
      title: "Notes - Figma",
      url: "https://www.figma.com/file/...",
      note: "",
    },
  });

  return (
    <>
      <Topbar>
        <div className="flex flex-1 justify-between">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/">BACK</Link>
          </Button>
          <Button variant="ghost" size="lg" onClick={form.handleSubmit((d) => console.log(d))}>
            CREATE
          </Button>
        </div>
      </Topbar>

      <NoteView form={form} />
    </>
  );
};
