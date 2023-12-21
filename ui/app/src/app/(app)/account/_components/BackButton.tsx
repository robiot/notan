import { Button } from "@notan/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

export const BackButton: FC = () => {
  return (
    <Button variant="outline" size="icon" asChild>
      <Link href={"/account"}>
        <ChevronLeft />
      </Link>
    </Button>
  );
};
