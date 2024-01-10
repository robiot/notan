"use client";

import { FC, ReactNode } from "react";

import { AuthContext } from "@/components/context/AuthContext";

import { UsernameModal } from "./_components/modals/username/UsernameModal";
import { SideNavigationBar } from "./_components/Navigation/SideNavigationBar";
import { TopNavigation } from "./_components/Navigation/TopNavigation";

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthContext type="app">
      <div className="flex-1 flex flex-col max-h-screen">
        <UsernameModal />
        <TopNavigation />

        <div className="flex flex-1 overflow-hidden">
          <SideNavigationBar />

          <div className="flex max-h-full flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </AuthContext>
  );
};

export default AppLayout;
