import { FC, ReactNode } from "react";

import { PageTitle } from "@/components/common/PageTitle";

import { BackButton } from "./BackButton";

export const ItemTitleRow: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex items-center gap-5">
      <BackButton />
      <PageTitle>{children}</PageTitle>
    </div>
  );
};
