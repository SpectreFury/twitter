"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import NavigationAsideButton from "./NavigationAsideButton";
import { Button } from "@/components/ui/button";

import {
  Home,
  Search,
  Bell,
  UserPlus,
  MessageSquare,
  Orbit,
  Bookmark,
  Rocket,
  BadgeCheck,
  User,
  Ellipsis,
} from "lucide-react";
import UserProfile from "./UserProfile";
import { User as UserType } from "@/types/user";
import NavigationAsideSkeleton from "./NavigationAsideSkeleton";

const NAVIGATION_ITEMS = [
  {
    title: "Home",
    icon: Home,
    href: "/home",
  },
  {
    title: "Explore",
    icon: Search,
    href: "/explore",
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  {
    title: "Follow",
    icon: UserPlus,
    href: "/follow",
  },
  {
    title: "Chat",
    icon: MessageSquare,
    href: "/chat",
  },
  {
    title: "Grok",
    icon: Orbit,
    href: "/grok",
  },
  {
    title: "Bookmarks",
    icon: Bookmark,
    href: "/bookmarks",
  },
  {
    title: "Creator Studio",
    icon: Rocket,
    href: "/studio",
  },
  {
    title: "Premium",
    icon: BadgeCheck,
    href: "/premium",
  },
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    title: "More",
    icon: Ellipsis,
    href: "/more",
  },
];

const NavigationAside = () => {
  const [user, setUser] = useState<UserType | null>(null);
  console.log("User: ", user);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();
      setUser({
        firstName: result.data.first_name,
        lastName: result.data.last_name,
        imageUrl: result.data.image_url,
        email: result.data.email,
        handle: result.data.handle,
        id: result.data.id,
      });
    };

    fetchUser();
  }, []);

  if (!user) return <NavigationAsideSkeleton/>;

  return (
    <aside className="h-screen flex flex-col gap-6">
      <div className="mt-2 px-4">
        <Image src="/svg/x.svg" width={30} height={30} alt="X logo" />
      </div>

      <ul className="flex flex-col gap-2">
        {NAVIGATION_ITEMS.map((item) => (
          <NavigationAsideButton
            key={item.title}
            title={item.title}
            icon={item.icon}
            href={item.href === "/profile" ? `/${user.handle}` : item.href}
          />
        ))}
      </ul>

      <Button className="rounded-full py-6 text-lg font-semibold">Post</Button>

      <UserProfile user={user} />
    </aside>
  );
};

export default NavigationAside;
