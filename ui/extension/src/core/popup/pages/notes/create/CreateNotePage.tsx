/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Container } from "@popup/components/app/Container";
import { Topbar } from "@popup/components/app/Topbar";
import { Button } from "@popup/components/ui/button";
import { Link } from "react-router-dom";

export const CreateNotePage = () => {
  return (
    <>
      <Topbar>
        <div className="flex flex-1 justify-between">
          <Button variant="ghost" size="lg" asChild>
            <Link to="/">BACK</Link>
          </Button>
          <Button variant="ghost" size="lg">
            CREATE
          </Button>
        </div>
      </Topbar>
      <Container>
        <div className="flex flex-col gap-2 items-center py-5">
          <input
            className="text-2xl font-bold focus:!outline-none bg-transparent text-center"
            contentEditable
            defaultValue="Notes - Figma"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}></input>

          <div></div>
        </div>
      </Container>
    </>
  );
};
