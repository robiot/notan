import { Card, CardContent, CardTitle } from "@notan/components/ui/card";
import { FC, ReactNode } from "react";

export const InfoCard: FC<{
  icon: ReactNode;
  title: string;
  children: ReactNode;
}> = ({ icon, title, children }) => {
  return (
    <Card className="flex flex-col px-12 pb-12">
      <CardTitle className="text-left py-10">{icon}</CardTitle>

      <CardContent className="flex flex-col gap-5 p-0 text-left">
        <span className="font-medium">{title}</span>
        <p className="text-foreground/80 text-base">{children}</p>
      </CardContent>
    </Card>
  );
};
