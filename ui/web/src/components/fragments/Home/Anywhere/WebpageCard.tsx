import { Card } from "@notan/components/ui/card";
import { FC, ReactNode } from "react";

export const WebpageCard: FC<{
  title: string;
  children: ReactNode;
  image: ReactNode;
}> = ({ title, children, image }) => {
  return (
    <Card className="p-8 flex gap-8 py-5">
      <div className="w-16 flex justify-center items-center">{image}</div>
      <div>
        <span className="font-medium">{title}</span>
        <p className="text-base leading-relaxed text-foreground/80 pt-1">
          {children}
        </p>
      </div>
    </Card>
  );
};
