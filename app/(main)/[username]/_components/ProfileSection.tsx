import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, Link, CalendarDays, ChevronRight } from "lucide-react";

const ProfileSection = () => {
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
            src="https://github.com/shadcn.png"
            alt="Profile picture"
            width={140}
            height={140}
            className="rounded-full"
          />
        </div>

        <Button variant="outline" className="px-6 rounded-full font-bold">
          Edit profile
        </Button>
      </div>

      <div className="ml-6 mt-6">
        <div className="text-xl font-bold">Ayush Soni</div>
        <div className="text-gray-500">@spectrefuryiwnl</div>
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
          <div>Joined January 2022</div>
          <ChevronRight className="h-5! w-5!" />
        </div>
      </div>

      <div className="mt-2 ml-6 flex gap-4">
        <div className="flex gap-1">
          <div>10</div>
          <div className="text-muted-foreground">following</div>
        </div>
        <div className="flex gap-1">
          <div>10</div>
          <div className="text-muted-foreground">followers</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
