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
import { dayjs } from "@/lib/dayjs";
import Link from "next/link";

type TweetCardProps = {
  id: number;
  firstName: string;
  lastName: string;
  handle: string;
  content: string;
  createdAt: string;
  imageUrl?: string;
  onLike: (tweetId: number) => void;
  isLiked: boolean;
  likeCount: number;
};

const TweetCard = ({
  id,
  firstName,
  lastName,
  content,
  handle,
  createdAt,
  imageUrl = "https://github.com/shadcn.png",
  onLike,
  isLiked,
  likeCount,
}: TweetCardProps) => {
  return (
    <Link
      href={`/${handle}/${id}`}
      className="flex justify-between border border-gray-100 border-t-0 p-2 gap-2 hover:bg-gray-50 cursor-pointer"
    >
      <div>
        <Image
          src={imageUrl}
          alt="Profile image"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col w-2xl">
        <div className="flex justify-between items-center">
          <div className="flex gap-1 items-center">
            <div className="font-semibold">
              {firstName} {lastName}
            </div>
            <div className="text-muted-foreground text-sm">
              {handle ? `@${handle}` : "Not set"}
            </div>
            <Dot className="text-muted-foreground" size={20} />
            <div className="text-muted-foreground text-sm">
              {dayjs(createdAt).fromNow()}
            </div>
          </div>

          <Button variant="ghost" className="rounded-full">
            <Ellipsis />
          </Button>
        </div>
        <div>{content}</div>
        <div className="flex justify-between mt-1">
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
            className="cursor-pointer rounded-full hover:bg-pink-50 hover:text-pink-500"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              onLike(id);
            }}
          >
            <Heart className={isLiked ? "fill-pink-500 text-white" : ""} />
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
    </Link>
  );
};

export default TweetCard;
