"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Link,
  CalendarDays,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import ProfileSectionSkeleton from "./ProfileSectionSkeleton";
import { dayjs } from "@/lib/dayjs";

const ProfileSection = () => {
  const { username } = useParams();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Log in");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/profile/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      throw new Error(result.mesesage);
    }

    const result = await response.json();
    return result;
  };

  const followProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Log in");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/profile/${username}/follow`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error);
    }

    const result = await response.json();
    return result;
  };

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchProfile,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: followProfile,
    onSuccess: (result) => {
      console.log("Follow result: ", result);
    },
    onError: (error) => {
      console.log("Follow error: ", error);
    },
  });

  if (isLoading) {
    return <ProfileSectionSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full max-w-2xl p-6 my-8 mx-auto flex flex-col items-center justify-center text-center border rounded-2xl bg-destructive/5 border-destructive/20 gap-3">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <h3 className="text-lg font-semibold text-foreground">
          Unable to load profile
        </h3>
        <p className="text-sm text-muted-foreground max-w-md">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  console.log("Profile: ", profile);

  return (
    <div className="w-2xl flex flex-col">
      <div>
        <Image
          src="/profile-wall.jpg"
          alt="Wallpaper"
          width={600}
          height={200}
          className="w-full object-cover"
        />
      </div>

      <div className="w-2xl flex items-center justify-between self-start">
        <div className="ml-4 -mt-20 relative z-10 p-1 rounded-full bg-white self-start">
          <Image
            src={profile.data.image_url}
            alt="Profile picture"
            width={140}
            height={140}
            className="rounded-full"
          />
        </div>

        {profile.data.isCurrentUser ? (
          <Button variant="outline" className="px-6 rounded-full font-bold">
            Edit profile
          </Button>
        ) : (
          <Button
            disabled={isPending}
            className="px-6 rounded-full font-bold"
            onClick={() => mutate()}
          >
            Follow
          </Button>
        )}
      </div>

      <div className="ml-6 mt-6">
        <div className="text-xl font-bold">
          {profile.data.first_name} {profile.data.last_name}
        </div>
        <div className="text-gray-500">@{profile.data.handle}</div>
      </div>

      <div className="mt-2 ml-6">
        <div>
          learning a bunch of shit in computer science
          <br /> opengl is really fun at the moment
        </div>
      </div>

      <div className="mt-2 ml-6 flex gap-6">
        <div className="flex gap-1 items-center text-gray-500">
          <MapPin className="h-5! w-5!" />
          <div>Bhopal</div>
        </div>

        <div className="flex gap-1 items-center text-gray-500">
          <Link className="h-5! w-5!" />
          <a href="https://spectrefury.com">spectrefury.iwnl</a>
        </div>

        <div className="flex gap-1 items-center text-gray-500 hover:underline">
          <CalendarDays className="h-5! w-5!" />
          <div>Joined {dayjs(profile.data.createdAt).format("MMMM YYYY")}</div>
          <ChevronRight className="h-5! w-5!" />
        </div>
      </div>

      <div className="mt-2 ml-6 flex gap-4">
        <div className="flex gap-1">
          <div>{profile.data._count.following}</div>
          <div className="text-muted-foreground">following</div>
        </div>
        <div className="flex gap-1">
          <div>{profile.data._count.followedBy}</div>
          <div className="text-muted-foreground">followers</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
