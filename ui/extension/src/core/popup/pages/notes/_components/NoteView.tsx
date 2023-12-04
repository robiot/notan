import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Container } from "@/core/popup/components/app/Container";
import { Separator } from "@/core/popup/components/ui/separator";
import { faviconFromUrl } from "@/core/popup/lib/favicon";
import { zodRequiredString } from "@/core/popup/lib/zodPresents";

export const NoteFormSchema = z.object({
  title: zodRequiredString,
  url: zodRequiredString,
  note: z.string(),
});

export type NoteFormSchemaType = z.infer<typeof NoteFormSchema>;

export const NoteView: FC<{
  form: UseFormReturn<Partial<NoteFormSchemaType>, any, undefined>;
}> = ({ form: { register, watch } }) => {
  return (
    <Container>
      <div className="flex flex-col gap-2 items-center py-5">
        <input
          className="text-2xl font-bold focus:!outline-none bg-transparent text-center"
          placeholder="Title"
          defaultValue="Notes - Figma"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
          maxLength={30}
          {...register("title")}
        />

        <div className="flex gap-2">
          <img src={faviconFromUrl(watch("url"))} alt="" className="w-5 h-5 rounded" />

          <input
            className="text-sm focus:outline-none focus:border-b bg-transparent"
            placeholder="URL"
            defaultValue="https://www.figma.com/file/..."
            maxLength={200}
            {...register("url")}
          />
        </div>
      </div>

      <Separator />

      <div className="py-5 flex w-full px-3 flex-1">
        <textarea
          spellCheck="false"
          placeholder="Type a note here"
          className="text-sm bg-transparent w-full focus:outline-none resize-none"
          maxLength={200}
          {...register("note")}
        />
      </div>
    </Container>
  );
};
