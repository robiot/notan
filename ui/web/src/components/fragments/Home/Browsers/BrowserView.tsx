import Image from "next/image";
import { FC } from "react";

export const BrowserView: FC<{ image: string; name: string }> = ({
  image,
  name,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Image src={image} alt={name} width={120} height={120} className="w-8" />
      <span className="text-lg font-medium text-foreground/80">{name}</span>
    </div>
  );
};
