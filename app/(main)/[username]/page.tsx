"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import ProfileSection from "./_components/ProfileSection";
import TopBar from "./_components/TopBar";
import { useParams } from "next/navigation";
import TweetCard from "../home/_components/TweetCard";
import { queryClient } from "@/components/providers/QueryClientProvider";

const Profile = () => {
  const { username } = useParams<{ username: string }>();

  const handleLike = async (tweetId: number) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet/${tweetId}/likes`,
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

    return response.json();
  };

  const handleUnlike = async (tweetId: number) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet/${tweetId}/likes`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("Unable to unlike");

    return response.json();
  };

  const userTweetsQueryKey = ["user_tweets", username];

  const { mutate: likeMutation } = useMutation({
    mutationFn: handleLike,
    onMutate: async (tweetId) => {
      await queryClient.cancelQueries({ queryKey: userTweetsQueryKey });

      const previousData = queryClient.getQueryData(userTweetsQueryKey);

      queryClient.setQueryData(userTweetsQueryKey, (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((tweet: any) =>
            tweet.id === tweetId
              ? {
                  ...tweet,
                  isLiked: true,
                  likeCount: (tweet.likeCount || 0) + 1,
                }
              : tweet,
          ),
        };
      });

      return { previousData };
    },

    onError: (error, _tweetId, context) => {
      console.error("Like error: ", error);
      if (context?.previousData) {
        queryClient.setQueryData(userTweetsQueryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userTweetsQueryKey });
    },
  });

  const { mutate: unlikeMutation } = useMutation({
    mutationFn: handleUnlike,
    onMutate: async (tweetId) => {
      await queryClient.cancelQueries({ queryKey: userTweetsQueryKey });

      const previousData = queryClient.getQueryData(userTweetsQueryKey);

      queryClient.setQueryData(userTweetsQueryKey, (old: any) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((tweet: any) =>
            tweet.id === tweetId
              ? {
                  ...tweet,
                  isLiked: false,
                  likeCount: Math.max(0, (tweet.likeCount || 1) - 1),
                }
              : tweet,
          ),
        };
      });

      return { previousData };
    },

    onError: (error, _tweetId, context) => {
      console.error("Unlike error: ", error);
      if (context?.previousData) {
        queryClient.setQueryData(userTweetsQueryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userTweetsQueryKey });
    },
  });

  const fetchUserTweet = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is required");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("We have an error");

    return response.json();
  };

  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: userTweetsQueryKey,
    queryFn: fetchUserTweet,
    enabled: !!username,   });

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  const tweets = result?.data || [];

  return (
    <div className="flex flex-col">
      <TopBar />
      <ProfileSection />
      <div className="max-w-2xl">
        {tweets.map((tweet: any) => (
          <TweetCard
            key={tweet.id}
            id={tweet.id}
            content={tweet.content}
            createdAt={tweet.createdAt}
            firstName={tweet.user.first_name}
            lastName={tweet.user.last_name}
            imageUrl={tweet.user.image_url}
            handle={tweet.user.handle}
            onLike={likeMutation}
            onUnlike={unlikeMutation}
            isLiked={tweet.isLiked}
            likeCount={tweet.likeCount}
            replyCount={tweet.replyCount}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
