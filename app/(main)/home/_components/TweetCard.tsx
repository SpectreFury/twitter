import Image from "next/image";
import {
  Dot,
  Ellipsis,
  Heart,
  MessageCircle,
  Repeat2,
  ChartNoAxesColumn,
  Bookmark,
  Share,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TweetCardProps = {
  name: string;
  handle: string;
  uploadTime: string;
  imageUrl?: string;
};

const TweetCard = ({
  name,
  handle,
  uploadTime,
  imageUrl = "https://github.com/shadcn.png",
}: TweetCardProps) => {
  return (
    <div className="flex justify-between border border-gray-100 border-t-0 px-2 py-6 gap-2">
      <div>
        <Image
          src={imageUrl}
          alt="Profile image"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col w-2xl gap-1">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <div className="font-semibold">{name}</div>
            <div className="text-muted-foreground text-sm">{handle}</div>
            <Dot className="text-muted-foreground" size={20} />
            <div className="text-muted-foreground text-sm">{uploadTime}</div>
          </div>

          <Button variant="ghost" className="rounded-full">
            <Ellipsis />
          </Button>
        </div>
        <div>Awesome sauce</div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            className="rounded-full hover:bg-blue-50 hover:text-blue-500"
          >
            <MessageCircle />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full hover:bg-emerald-50 hover:text-emerald-500"
          >
            <Repeat2 />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full hover:bg-pink-50 hover:text-pink-500"
          >
            <Heart />
          </Button>
          <Button
            variant="ghost"
            className="rounded-full hover:bg-blue-50 hover:text-blue-500"
          >
            <ChartNoAxesColumn />
          </Button>
          <div>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-blue-50 hover:text-blue-500"
            >
              <Bookmark />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full hover:bg-blue-50 hover:text-blue-500"
            >
              <Share />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
