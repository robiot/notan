import { Button } from "@notan/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useUser } from "@/hooks/users/useUser";

import { SideNavigationBar } from "./SideNavigationBar";

export const TopNavigation = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const user = useUser();

  return (
    <>
      <nav className="bg-card w-full flex h-20 z-50 items-center justify-between px-4 border-border border-b">
        <Image
          src={"/notan.svg"}
          alt="logo"
          width={105}
          height={50}
          className="h-7`"
        />

        <div className="flex gap-2 items-center">
          <div className="px-2">{user.data?.username}</div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => {
              setNavbarOpen(!navbarOpen);
            }}
          >
            {navbarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {navbarOpen && (
        <SideNavigationBar
          mobile
          close={() => {
            setNavbarOpen(false);
          }}
        />
      )}
    </>
  );
};
