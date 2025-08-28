"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Player } from "@/components/player";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isVideoMode, setIsVideoMode] = useState(false);

  const [currentTrack, setCurrentTrack] = useState({
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "/placeholder.svg?height=60&width=60",
    duration: 203,
    isPlaying: false,
  });

  const togglePlay = () => {
    setCurrentTrack((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }));
  };

  const toggleVideoMode = () => {
    setIsVideoMode((prev) => !prev);
  };

  return (
    <div
      className="flex h-screen flex-col bg-background text-foreground"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-24">{children}</main>
      </div>
      <Player
        track={currentTrack}
        onTogglePlay={togglePlay}
        isVideoMode={isVideoMode}
        onToggleVideoMode={toggleVideoMode}
      />
    </div>
  );
}
