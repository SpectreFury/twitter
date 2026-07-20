"use client";

import TweetCard from "./_components/TweetCard";
import TweetInput from "./_components/TweetInput";
import { useQuery } from "@tanstack/react-query";

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
          content={tweet.content}
          createdAt={tweet.createdAt}

          firstName={tweet.user.first_name}
          lastName={tweet.user.last_name}
          imageUrl={tweet.user.image_url}
          handle={tweet.user.handle}
        />
      ))}
    </div>
  );
};

export default HomePage;
