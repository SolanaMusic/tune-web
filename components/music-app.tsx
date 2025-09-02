"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout";
import { HomeView } from "@/components/views/home-view";
import { PlaylistView } from "@/components/views/playlist-view";
import { ProfileView } from "@/components/views/profile-view";
import { ArtistView } from "@/components/views/artist-view";
import { AlbumView } from "@/components/views/album-view";
import { SubscriptionView } from "@/components/views/subscription-view";
import { AdminDashboardView } from "@/components/views/admin-dashboard-view";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/UserStore";

export type ViewType =
  | "home"
  | "explore"
  | "library"
  | "playlist"
  | "profile"
  | "artist"
  | "album"
  | "subscription"
  | "admin";

export function MusicApp() {
  const [currentView, setCurrentView] = useState<ViewType>("home");
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null);
  const [currentArtistId, setCurrentArtistId] = useState(0);
  const [currentAlbumId, setCurrentAlbumId] = useState(0);
  const { setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    handleExternalUser();
  }, []);

  const handleExternalUser = () => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");

    if (!token) return;

    const user = {
      id: Number(url.searchParams.get("id")),
      name: url.searchParams.get("username")!,
      role: url.searchParams.get("role")!,
      avatar: url.searchParams.get("avatar")!,
      tokensAmount: Number(url.searchParams.get("tokensAmount")),
      token,
    };

    setUser(user);
    router.replace("/");
  };

  return (
    <Layout>
      {currentView === "home" && <HomeView />}
      {currentView === "playlist" && <PlaylistView id={currentPlaylist} />}
      {currentView === "profile" && <ProfileView />}
      {currentView === "artist" && <ArtistView id={currentArtistId} />}
      {currentView === "album" && <AlbumView id={currentAlbumId} />}
      {currentView === "subscription" && <SubscriptionView />}
      {currentView === "admin" && <AdminDashboardView />}
    </Layout>
  );
}
