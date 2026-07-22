"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Bookmark,
  Dot,
  Ellipsis,
  Heart,
  ImageIcon,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { dayjs } from "@/lib/dayjs";
import TweetCard from "../../home/_components/TweetCard";
import ReplyCard from "../../home/_components/ReplyCard";

const TweetDetail = () => {
  const params = useParams();
  const { username, tweetId } = params;

  const [reply, setReply] = useState("");

  const createTweet = async () => {
    if (!reply) throw new Error("Reply content is required");

    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token");

    const body = {
      content: reply,
      parentTweetId: tweetId,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) throw new Error("Unable to create reply");

    const result = await response.json();
    return result;
  };

  const fetchTweet = async () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet/${username}/${tweetId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message);
    }

    return result;
  };

  const {
    data: result,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tweet", tweetId],
    queryFn: fetchTweet,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTweet,
    onSuccess: (result) => {
      console.log("Result: ", result);
    },
    onError: (error) => {
      console.log("Error: ", error);
    },
  });

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        <p className="font-semibold text-lg">
          {error?.message || "Post not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border border-gray-100 border-y-0 px-4 ">
      <div className="flex items-center w-2xl">
        <Button variant="ghost" className="rounded-full">
          <ArrowLeft className="w-5! h-5!" />
        </Button>

        <div className="text-lg font-semibold">Post</div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div>
            <Image
              src={result.data.user.image_url}
              alt="Profile photo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="font-medium">
              {result.data.user.first_name} {result.data.user.last_name}
            </div>
            <div className="text-muted-foreground text-sm">
              {result.data.user.handle}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="rounded-full hover:bg-blue-50 hover:text-blue-500"
        >
          <Ellipsis />
        </Button>
      </div>

      <div className="text-lg">{result.data.content}</div>

      <div className="flex items-center text-gray-500">
        <div>{dayjs(result.data.createdAt).format("h:mm A")}</div>
        <Dot />
        <div>{dayjs(result.data.createdAt).format("MMM D, YYYY")}</div>
      </div>

      <Separator />

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
          className="rounded-full hover:bg-pink-50 hover:text-pink-500"
        >
          <Heart />
        </Button>
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

      <div className="flex">
        <div>
          <Image
            src="https://github.com/shadcn.png"
            alt="User profile"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col w-2xl">
          <Textarea
            placeholder="Post your reply"
            className="border-none outline-none shadow-none resize-none text-xl! text-gray-700 focus-visible:ring-0"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="text-gray-500 self-start rounded-full"
            >
              <ImageIcon className="h-5! w-5!" />
            </Button>

            <Button
              disabled={isPending || !reply}
              className="rounded-full py-2 px-6"
              onClick={() => mutate()}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>

      {result.data.replies.map((reply: any) => (
        <ReplyCard
          key={reply.id}
          id={reply.id}
          content={reply.content}
          createdAt={reply.createdAt}
          firstName={reply.user.first_name}
          lastName={reply.user.last_name}
          handle={reply.user.handle}
          imageUrl={reply.user.image_url}
        />
      ))}
    </div>
  );
};

export default TweetDetail;
