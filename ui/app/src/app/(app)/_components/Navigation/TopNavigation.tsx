import { Button } from "@notan/components/ui/button";
import Image from "next/image";

export const TopNavigation = () => {
  //   const currentUser = data?.currentUser;

  return (
    <nav className="bg-card w-full flex h-20 items-center justify-between px-4  border-border border-b">
      <Image
        src={"/notan.svg"}
        alt="logo"
        width={134}
        height={50}
        className="h-8"
      />

      <Button variant="ghost">robiot</Button>
    </nav>
  );
};
