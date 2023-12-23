import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { Plus, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

import { Input } from "../../components/ui/input";
import { createAppUrl } from "../../lib/urlUtils";
import { HomeNotes } from "./_components/HomeNotes";

export const HomePage = () => {
  const form = useForm<{ search: string }>();

  const [search] = useDebounce(form.watch("search"), 300);

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
          placeholder="Search notes by domain/content"
          className="w-full"
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
