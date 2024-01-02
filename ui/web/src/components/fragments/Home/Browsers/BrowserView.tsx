import Image from "next/image";
import { FC } from "react";

export const BrowserView: FC<{ image: string; name: string }> = ({
  image,
  name,
}) => {
  return (
    <li className="flex items-center gap-4 px-7">
      <Image
        src={image}
        alt={name}
        width={120}
        height={120}
        className="w-8 grayscale"
      />
      <span className="text-lg text-foreground/80">{name}</span>
    </li>
  );
};
