import { Button } from "@notan/components/ui/button";
import { Input } from "@notan/components/ui/input";
import { Topbar } from "@popup/components/app/Topbar";
import { Plus, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

import { createAppUrl } from "../../lib/urlUtils";
import { HomeNotes } from "./_components/HomeNotes";

export const HomePage = () => {
  const form = useForm<{ search: string }>();

  const [search] = useDebounce(form.watch("search"), 300);

  useEffect(() => {
    form.setFocus("search");
  }, []);

  // todo add loader here
  return (
    <>
      <Topbar>
        <Button variant="ghost" size="icon" asChild>
          <Link to={createAppUrl("/account")} target="_blank">
            <User />
          </Link>
        </Button>
        <Input
          inputSize="small"
          placeholder="Search notes, use * to show all"
          className="w-full focus-visible:ring-0"
          {...form.register("search")}
        />
        <Button variant="ghost" size="icon" asChild>
          <Link to="/notes/create">
            <Plus />
          </Link>
        </Button>
      </Topbar>

      <div className="flex flex-col overflow-auto gap-2 p-2 h-full max-h-full">
        <HomeNotes search={search} />
      </div>
    </>
  );
};
