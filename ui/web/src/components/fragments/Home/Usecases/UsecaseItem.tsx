import { FC } from "react";

import { Card } from "@/components/ui/card";

export const UsecaseItem: FC<{
  title: string;
  description: string;
}> = ({ title, description }) => {
  return (
    <Card className="p-7">
      <h4 className="text-accent text-xl font-bold">{title}</h4>
      <p className="text-base text-foreground/80">{description}</p>
    </Card>
  );
};
