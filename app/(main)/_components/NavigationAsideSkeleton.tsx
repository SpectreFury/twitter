import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NavigationAsideSkeleton() {
  // Array of 11 items matching your sidebar links
  const skeletonItems = Array.from({ length: 11 });

  return (
    <aside className="flex flex-col h-screen w-64 p-4 select-none">
      {/* Top Section */}
      <div className="flex flex-col gap-1">
        {/* X Logo Skeleton */}
        <div className="p-3">
          <Skeleton className="w-7 h-7 rounded-full" />
        </div>

        {/* Navigation Items Skeleton */}
        <div className="flex flex-col gap-2 mt-1">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3"
            >
              {/* Icon Placeholder */}
              <Skeleton className="w-6 h-6 rounded-full shrink-0" />
              
              {/* Text Placeholder */}
              <Skeleton
                className="h-5 rounded-md"
                style={{
                  width: `${Math.floor(Math.random() * (110 - 60 + 1)) + 60}px`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile Footer Skeleton */}
      <div className="flex items-center justify-between p-3 mt-20">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          
          {/* User Info Placeholders */}
          <div className="flex flex-col gap-1.5">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-20 h-3 rounded-md" />
          </div>
        </div>

        {/* More Menu Ellipsis Placeholder */}
        <Skeleton className="w-5 h-5 rounded-full shrink-0" />
      </div>
    </aside>
  );
}
