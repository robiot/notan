/* eslint-disable no-unreachable */
"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@notan/components/ui/dialog";
import { Rocket } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";

import { SubscriptionsSection } from "./SubscriptionsSection";

export const UpgradeModal: FC<{ children: ReactNode }> = ({ children }) => {
  const parameters = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean | undefined>();

  useEffect(() => {
    if (parameters.get("upgrade") == "true") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [parameters]);

  if (isOpen == undefined) return null;

  return (
    <>
      <Dialog defaultOpen={isOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-[50rem] max-h-screen overflow-y-auto">
          <DialogHeader className="flex flex-row gap-2 text-xl font-bold">
            <Rocket />
            All plans
          </DialogHeader>
          <SubscriptionsSection />

          <DialogFooter className="mt-2 !justify-center items-center gap-1">
            <div className="flex">
              <Image
                alt="person"
                src="/people/1.png"
                width={50}
                height={50}
                className="rounded-full h-7 w-7 border-2 border-border"
              />
              <Image
                alt="person"
                src="/people/2.png"
                width={50}
                height={50}
                className="rounded-full -ml-2 h-7 w-7 border-2 border-border"
              />
              <Image
                alt="person"
                src="/people/3.png"
                width={50}
                height={50}
                className="rounded-full -ml-2 h-7 w-7 border-2 border-border"
              />
            </div>
            <div className="text-xs">
              Join tons of other Notan users improving their browser experience.
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
