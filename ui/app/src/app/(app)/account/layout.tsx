import { FC, ReactNode } from "react";

import { Container } from "@/components/common/Container";

const AccountLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Container size="small" className="flex flex-col">
      {children}
    </Container>
  );
};

export default AccountLayout;
