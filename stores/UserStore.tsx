"use client";

import { Loader2 } from "lucide-react";
import { create } from "zustand";
import { useEffect, useState, ReactNode } from "react";

type User = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  tokensAmount: number;
  token: string;
};

type UserState = {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (u) => {
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
    }
    set({ user: u });
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    set({ user: null });
  },
}));

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, [setUser]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );

  return <>{children}</>;
};
