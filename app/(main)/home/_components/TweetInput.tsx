"use client";

import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const TweetInput = () => {
  const [content, setContent] = useState("");
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const sendTweet = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token not found");

      const body = {
        content,
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

      const result = await response.json();
      return result;
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: sendTweet,
    onSuccess: (data) => {
      console.log("Data: ", data);

      setContent("");
      if (contentRef.current) {
        contentRef.current.value = "";
      }
    },
    onError: (error) => {
      console.log("Error: ", error);
    },
  });

  return (
    <div className="flex justify-between border border-gray-100 border-t-0 px-2 py-6 gap-2">
      <div>
        <Image
          src="https://github.com/shadcn.png"
          alt="User profile"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex flex-col w-2xl gap-2">
        <Textarea
          ref={contentRef}
          placeholder="What's happening?"
          className="border-none outline-none shadow-none resize-none text-xl! text-gray-700 focus-visible:ring-0"
          onChange={(e) => setContent(e.target.value)}
        />
        <Separator className="bg-gray-100" />
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-gray-500 self-start rounded-full"
          >
            <ImageIcon className="h-5! w-5!" />
          </Button>

          <Button
            disabled={isPending || !content}
            className="rounded-full py-2 px-6"
            onClick={() => mutate()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TweetInput;
