import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSectionSkeleton() {
  return (
    <div className="w-2xl flex flex-col">
      {/* 1. Banner Placeholder */}
      <Skeleton className="w-full h-48 rounded-none" />

      {/* 2. Avatar & Action Button Header */}
      <div className="w-2xl flex items-center justify-between px-4 -mt-16 relative z-10">
        {/* Profile Picture Circle */}
        <div className="p-1 rounded-full bg-white dark:bg-black">
          <Skeleton className="w-[140px] h-[140px] rounded-full" />
        </div>

        {/* Follow/Edit Profile Button Placeholder */}
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      {/* 3. Name & Username */}
      <div className="px-6 mt-4 flex flex-col gap-2">
        {/* Full Name */}
        <Skeleton className="h-6 w-36 rounded-md" />
        {/* Username (@handle) */}
        <Skeleton className="h-4 w-28 rounded-md" />
      </div>

      {/* 4. Bio */}
      <div className="px-6 mt-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-4/5 rounded-md" />
        <Skeleton className="h-4 w-3/5 rounded-md" />
      </div>

      {/* 5. Metadata Row (Location, Website, Join Date) */}
      <div className="px-6 mt-4 flex gap-6">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-4 w-36 rounded-md" />
      </div>

      {/* 6. Followers / Following Stats */}
      <div className="px-6 mt-4 flex gap-4">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </div>
    </div>
  );
}
