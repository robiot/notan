import Image from "next/image";

import { useUser } from "@/hooks/users/useUser";

export const TopNavigation = () => {
  //   const currentUser = data?.currentUser;

  const user = useUser();

  return (
    <nav className="bg-card w-full flex h-20 items-center justify-between px-4 border-border border-b">
      <Image
        src={"/notan.svg"}
        alt="logo"
        width={105}
        height={50}
        className="h-7`"
      />

      <div className="px-2">{user.data?.username}</div>
    </nav>
  );
};
