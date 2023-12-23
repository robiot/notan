import { Separator } from "@notan/components/ui/separator";
import { Link as LinkIcon } from "lucide-react";
import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

import { Container } from "@/core/popup/components/app/Container";
import { faviconFromUrl } from "@/core/popup/lib/favicon";
import { zodRequiredString } from "@/core/popup/lib/zodPresents";

import { URLInput } from "./URLInput";

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
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
            }
          }}
          maxLength={100}
          {...register("title")}
        />

        <div className="flex gap-2 items-center w-fit">
          <Link to={watch("url")} target="_blank">
            {faviconFromUrl(watch("url")) !== undefined ? (
              <img src={faviconFromUrl(watch("url"))} alt="" className="w-5 h-5 rounded" />
            ) : (
              <LinkIcon className="text-sm h-4 w-4" />
            )}
          </Link>

          <URLInput placeholder="URL" maxLength={200} currentValue={watch("url")} {...register("url")} />
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
