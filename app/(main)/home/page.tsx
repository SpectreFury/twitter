"use client";

import TweetCard from "./_components/TweetCard";
import TweetInput from "./_components/TweetInput";
import { useMutation, useQuery } from "@tanstack/react-query";

const HomePage = () => {
  const fetchTweets = async () => {
    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/tweet`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("Failed to fetch tweets");

    const result = await response.json();
    return result.data;
  };

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

    const result = await response.json();
    return result;
  };

  const { mutate: likeMutation, isPending } = useMutation({
    mutationFn: handleLike,
    onSuccess: (result) => {
      console.log("Result: ", result);
    },
    onError: (error) => {
      console.log("Error: ", error);
    },
  });

  const {
    data: tweets,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tweets"],
    queryFn: fetchTweets,
  });

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;

  console.log(tweets);

  return (
    <div className="flex flex-col">
      <TweetInput />

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
          isLiked={tweet.isLiked}
          likeCount={tweet.likeCount}
        />
      ))}
    </div>
  );
};

export default HomePage;
