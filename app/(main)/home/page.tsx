import TweetCard from "./_components/TweetCard";
import TweetInput from "./_components/TweetInput";

const TWEETS = [
  {
    name: "Ayush Soni",
    handle: "@spectrefuryiwnl",
    uploadTime: "1 min",
    content: "Awesome sauce",
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <TweetInput />

      {TWEETS.map((tweet) => (
        <TweetCard
          key={Date.now()}
          name={tweet.name}
          handle={tweet.handle}
          uploadTime={tweet.uploadTime}
        />
      ))}
    </div>
  );
};

export default HomePage;
