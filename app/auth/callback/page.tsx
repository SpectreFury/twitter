"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const GoogleCallback = () => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

  const params = useSearchParams();
  const router = useRouter();

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

      if (!response.ok) {
        router.replace("/");
        return;
      }

      const result = await response.json();

      console.log("Google result: ", result);
      localStorage.setItem("token", result.data.token)

      router.replace("/onboarding")
    };

    loginToGoogle();
  }, [code]);

  return <div></div>;
};

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>Loading security context</p>
        </div>
      }
    >
      <GoogleCallback />
    </Suspense>
  );
}
