"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const storedToken = localStorage.getItem("token");

    if (!storedToken && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, token]);

  return <>{children}</>;
}
