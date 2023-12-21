"use client";

import { Button } from "@notan/components/ui/button";
import { Spinner } from "@notan/components/ui/spinner";
import { ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import { FC } from "react";

import { PageTitle } from "@/components/common/PageTitle";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/users/useUser";

const FieldButton: FC<{ title: string; value?: string; path: string }> = ({
  title,
  value,
  path,
}) => {
  return (
    <Button
      variant="ghost"
      className="h-fit px-4 py-3 w-full bg-secondary justify-between"
      size="icon"
      asChild
    >
      <Link href={path}>
        <div className="font-normal flex flex-col gap-[0.1rem]">
          <span className="text-sm text-secondary-foreground/70">{title}</span>
          <span className="text-sm">{value}</span>
        </div>
        <ChevronRight />
      </Link>
    </Button>
  );
};

export default function AccountPage() {
  const auth = useAuth();
  const user = useUser();

  if (user.isLoading) return <Spinner size="md" className="self-center mt-5" />;

  return (
    <>
      <PageTitle>My Account</PageTitle>
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          <FieldButton
            title="Username"
            value={user.data?.username}
            path="/account/username"
          />
          <FieldButton
            title="Email"
            value={user.data?.email}
            path="/account/email"
          />
          <FieldButton title="Password" path="/account/password" />

          <Button
            variant="ghost"
            className="mt-4 gap-3"
            onClick={() => auth.logout()}
          >
            <LogOut />
            Log out
          </Button>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <Button variant="ghost" className="w-full mb-5">
            <Link href={"https://forms.gle/3ucgQ8bwBa86iUPp8"} target="_blank">
              Reports bugs / Feedback
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
