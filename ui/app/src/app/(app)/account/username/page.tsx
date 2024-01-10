"use client";

import { useRouter } from "next/navigation";

import { UsernameForm } from "@/components/app/account/UsernameForm";
import { useUser } from "@/hooks/users/useUser";

import { ItemTitleRow } from "../_components/ItemTitleRow";

const AccountUsernamePage = () => {
  const user = useUser();
  const router = useRouter();

  if (user.isLoading) return <span>Loading</span>;

  return (
    <>
      <ItemTitleRow>Username</ItemTitleRow>

      <UsernameForm
        username={user.data?.username}
        onDone={() => {
          router.push("/");
        }}
      />
    </>
  );
};

export default AccountUsernamePage;
