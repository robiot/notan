import { FC, useState } from "react";

import { getBillingMail, getMail } from "@/lib/mail";
import { cn } from "@/lib/utils";

export const MailButton: FC<{
  mailType: "billing" | "info";
}> = ({ mailType }) => {
  // click to reveal email

  const [mail, setMail] = useState<string>();

  if (mail == undefined)
    return (
      <button
        onClick={() => {
          if (mailType === "billing") {
            setMail(getBillingMail());
          } else {
            setMail(getMail());
          }
        }}
        className={cn("w-fit text-foreground")}
      >
        Click to reveal
      </button>
    );

  return <span>{mail}</span>;
};
