"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { User } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";

type UserProfileProps = {
  user: User | null;
};

const UserProfile = ({ user }: UserProfileProps) => {
  const name = `${user?.firstName} ${user?.lastName}`;

  if (!user) {
    return (
      <div className="w-full flex items-center rounded-full gap-2 py-6">
        <Skeleton className="h-12 w-12 rounded-full" />

        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-4 w-[200]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      className="w-full flex items-center justify-between rounded-full py-6"
    >
      <Image
        src={user.imageUrl}
        alt="Profile image"
        width={40}
        height={40}
        className="rounded-full"
      />

      <div className="flex flex-col items-start">
        <p className="font-bold">{name}</p>
        <span className="text-gray-600 text-sm font-light">
          {user.handle ? user.handle : "Not set"}
        </span>
      </div>

      <Ellipsis />
    </Button>
  );
};

export default UserProfile;
