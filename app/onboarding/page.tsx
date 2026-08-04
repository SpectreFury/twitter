"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function Onboarding() {
  const [username, setUsername] = useState("");

  const router = useRouter();

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) throw new Error("Not okay");

    const result = await response.json();
    return result;
  };

  const updateUsername = async () => {
    if (!username) throw new Error("Username is required to continue");

    const token = localStorage.getItem("token");

    if (!token) throw new Error("No token found");

    const body = {
      username,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL!}/api/auth/onboard`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    );

    if (!response.ok) throw new Error("Not okay");

    const result = await response.json();
    return result;
  };

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["current_user"],
    queryFn: fetchCurrentUser,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUsername,
    onSuccess: (result) => {
      console.log("Username data: ", result);

      router.replace("/home");
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (result?.data?.handle) {
      router.replace("/home");
    }
  }, [result, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Set a username</CardTitle>
          <CardDescription>
            You cannot change it after you set it. Choose wisely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                placeholder="@ashharrrrrr"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            disabled={isPending}
            className="w-full"
            onClick={() => mutate()}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Onboarding;
