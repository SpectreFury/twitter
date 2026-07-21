"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return router.replace("/");
    }

    setIsLoggedIn(true);
  }, [router, pathname]);

  if (!isLoggedIn) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="text-lg">Logging in</div>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
