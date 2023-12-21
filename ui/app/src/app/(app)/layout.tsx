"use client";

import { FC, ReactNode } from "react";

import { SideNavigationBar } from "./_components/Navigation/SideNavigationBar";
import { TopNavigation } from "./_components/Navigation/TopNavigation";

const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col">
      <TopNavigation />

      <div className="flex flex-1">
        <SideNavigationBar />

        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
