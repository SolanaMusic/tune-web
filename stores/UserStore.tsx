"use client";

import { Loader2 } from "lucide-react";
import { create } from "zustand";
import { useEffect, useState, ReactNode } from "react";
import axios from "axios";

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
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");

    if (saved) {
      try {
        const parsedUser: User = JSON.parse(saved);
        setUser(parsedUser);

        axios
          .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}users/${parsedUser.id}`)
          .then((res) => {
            const updatedUser: User = {
              ...parsedUser,
              role: res.data.role,
              name: res.data.userName,
              avatar: getAvatarUrl(res.data.profile.avatarUrl),
              tokensAmount: res.data.profile.tokensAmount,
            };
            setUser(updatedUser);
          })
          .catch((err) => {
            console.error("Failed to fetch user:", err);
          });
      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, [setUser]);

  const getAvatarUrl = (avatarUrl: string) => {
    if (!avatarUrl) return "/placeholder.svg";

    return avatarUrl.startsWith("http")
      ? avatarUrl
      : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${avatarUrl}`;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );

  return <>{children}</>;
};
