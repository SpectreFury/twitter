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
import ReplyCard from "../../home/_components/ReplyCard";
import { queryClient } from "@/components/providers/QueryClientProvider";

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
      parentTweetId: Number(tweetId),
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
      setReply("");

      queryClient.setQueryData(["tweet", tweetId], (oldData: any) => {
        if (!oldData || !oldData.data) return oldData;

        const newReply = result.data;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            replies: [
              {
                ...newReply,
                isLiked: false,
                likeCount: 0,
              },
              ...oldData.data.replies,
            ],
          },
        };
      });
    },
    onError: (error) => {
      console.error("Error creating reply: ", error);
    },
  });

  const handleLike = async (idToLike: number) => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet/${idToLike}/likes`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok && response.status === 409)
      throw new Error("Duplicate like attempt");

    if (!response.ok) throw new Error("Unable to create like");

    const result = await response.json();
    return result;
  };

  const handleUnlike = async (idToUnlike: number) => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet/${idToUnlike}/likes`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("Unable to unlike");

    const result = await response.json();
    return result;
  };

  const updateTweetLikeState = (
    tweet: any,
    targetId: number,
    isLiking: boolean,
  ): any => {
    if (tweet.id === targetId) {
      return {
        ...tweet,
        isLiked: isLiking,
        likeCount: isLiking
          ? (tweet.likeCount || 0) + 1
          : Math.max(0, (tweet.likeCount || 1) - 1),
      };
    }

    if (tweet.replies && Array.isArray(tweet.replies)) {
      return {
        ...tweet,
        replies: tweet.replies.map((replyItem: any) =>
          updateTweetLikeState(replyItem, targetId, isLiking),
        ),
      };
    }

    return tweet;
  };

  const { mutate: likeMutation } = useMutation({
    mutationFn: handleLike,
    onMutate: async (targetTweetId: number) => {
      await queryClient.cancelQueries({ queryKey: ["tweet", tweetId] });

      const previousData = queryClient.getQueryData(["tweet", tweetId]);

      queryClient.setQueryData(["tweet", tweetId], (old: any) => {
        if (!old || !old.data) return old;

        return {
          ...old,
          data: updateTweetLikeState(old.data, targetTweetId, true),
        };
      });

      return { previousData };
    },

    onError: (err, _targetTweetId, context) => {
      console.log("Like error: ", err);
      if (context?.previousData) {
        queryClient.setQueryData(["tweet", tweetId], context.previousData);
      }
    },
  });

  const { mutate: unlikeMutation } = useMutation({
    mutationFn: handleUnlike,
    onMutate: async (targetTweetId: number) => {
      await queryClient.cancelQueries({ queryKey: ["tweet", tweetId] });

      const previousData = queryClient.getQueryData(["tweet", tweetId]);

      queryClient.setQueryData(["tweet", tweetId], (old: any) => {
        if (!old || !old.data) return old;

        return {
          ...old,
          data: updateTweetLikeState(old.data, targetTweetId, false),
        };
      });

      return { previousData };
    },

    onError: (err, _targetTweetId, context) => {
      console.log("Unlike error: ", err);
      if (context?.previousData) {
        queryClient.setQueryData(["tweet", tweetId], context.previousData);
      }
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

  const tweet = result.data;

  console.log("Tweet: ", tweet)

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
              src={tweet.user.image_url}
              alt="Profile photo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div>
            <div className="font-medium">
              {tweet.user.first_name} {tweet.user.last_name}
            </div>
            <div className="text-muted-foreground text-sm">
              {tweet.user.handle}
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

      <div className="text-lg">{tweet.content}</div>

      <div className="flex items-center text-gray-500">
        <div>{dayjs(tweet.createdAt).format("h:mm A")}</div>
        <Dot />
        <div>{dayjs(tweet.createdAt).format("MMM D, YYYY")}</div>
      </div>

      <Separator />

      <div className="flex justify-between mt-1">
        <Button
          variant="ghost"
          className="rounded-full hover:bg-blue-50 hover:text-blue-500"
        >
          <MessageCircle />
          {tweet.replyCount}
        </Button>
        <Button
          variant="ghost"
          className="rounded-full hover:bg-emerald-50 hover:text-emerald-500"
        >
          <Repeat2 />
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            tweet.isLiked ? unlikeMutation(tweet.id) : likeMutation(tweet.id)
          }
          className={`rounded-full hover:bg-pink-50 hover:text-pink-500 ${
            tweet.isLiked ? "text-pink-500" : ""
          }`}
        >
          <Heart className={tweet.isLiked ? "fill-pink-500" : ""} />
          {tweet.likeCount}
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

      {tweet.replies.map((replyItem: any) => (
        <ReplyCard
          key={replyItem.id}
          id={replyItem.id}
          content={replyItem.content}
          createdAt={replyItem.createdAt}
          firstName={replyItem.user.first_name}
          lastName={replyItem.user.last_name}
          handle={replyItem.user.handle}
          imageUrl={replyItem.user.image_url}
          onLike={likeMutation}
          onUnlike={unlikeMutation}
          isLiked={replyItem.isLiked}
          likeCount={replyItem.likeCount}
          replyCount={replyItem.replyCount}
        />
      ))}
    </div>
  );
};

export default TweetDetail;
