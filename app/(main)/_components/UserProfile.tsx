'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";

const UserProfile = () => {
  return (
    <Button
      variant="ghost"
      className="w-full flex items-center justify-between rounded-full py-6"
    >
      <Image
        src="https://github.com/shadcn.png"
        alt="Profile image"
        width={40}
        height={40}
        className="rounded-full"
      />

      <div className="flex flex-col items-start">
        <p className="font-bold">Ayush Soni</p>
        <span className="text-gray-600 text-sm font-light">
          @spectrefuryiwnl
        </span>
      </div>

      <Ellipsis />
    </Button>
  );
};

export default UserProfile;
