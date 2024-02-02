import { Button } from "@notan/components/ui/button";
import { Topbar } from "@popup/components/app/Topbar";
import { User } from "lucide-react";
import { useEffect } from "react";
import { FC } from "react/ts5.0";
import { useForm, UseFormReturn } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

import { useActiveSearch } from "../../hooks/persist/useActiveSearch";
import { createAppUrl } from "../../lib/urlUtils";
import { CreateNoteButton } from "./_components/buttons/CreateNoteButton";
import { HomeNotes } from "./_components/HomeNotes";
import { HomeSearch } from "./_components/search/HomeSearch";

type Data = {
  search: string;
};

export type HomeForm = UseFormReturn<Data, any, undefined>;

export const HomePage: FC<{
  values: {
    search?: string;
  };
}> = ({ values }) => {
  const searchFromBefore = useActiveSearch();

  const form = useForm<Data>({
    defaultValues: {
      search: searchFromBefore.search,
    },
  });

  const [search] = useDebounce(form.watch("search"), 300);

  useEffect(() => {
    form.setFocus("search");
  }, []);

  useEffect(() => {
    searchFromBefore.set(form.getValues("search"));
  }, [form.watch("search")]);

  return (
    <>
      <Topbar>
        <Button variant="ghost" size="icon" asChild>
          <Link to={createAppUrl("/account")} target="_blank">
            <User />
          </Link>
        </Button>
        <HomeSearch form={form} />

        <CreateNoteButton />
      </Topbar>

      <div className="flex flex-col overflow-auto gap-2 p-2 h-full max-h-full">
        <HomeNotes search={search} />
      </div>
    </>
  );
};
