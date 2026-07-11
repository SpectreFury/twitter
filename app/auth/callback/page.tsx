"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const GoogleCallback = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    const loginToGoogle = async () => {
      if (!code) return;

      const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();

      console.log("Google result: ", result);
    };

    loginToGoogle();
  }, [code]);

  return <div></div>;
};

export default GoogleCallback;
