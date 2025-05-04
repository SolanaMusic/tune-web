"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Player } from "@/components/player"
import type { ViewType } from "@/components/music-app"
import { ThemeProvider } from "@/components/theme-provider"

interface LayoutProps {
  children: React.ReactNode
  onNavigate: (view: ViewType, playlistId?: string) => void
}

export function Layout({ children, onNavigate }: LayoutProps) {
  const [isVideoMode, setIsVideoMode] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "/placeholder.svg?height=60&width=60",
    duration: 203,
    isPlaying: false,
  })

  const togglePlay = () => {
    setCurrentTrack((prev) => ({
      ...prev,
      isPlaying: !prev.isPlaying,
    }))
  }

  const toggleVideoMode = () => {
    setIsVideoMode((prev) => !prev)
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <Header onNavigate={onNavigate} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar onNavigate={onNavigate} />
          <main className="flex-1 overflow-y-auto pb-24">{children}</main>
        </div>
        <Player
          track={currentTrack}
          onTogglePlay={togglePlay}
          isVideoMode={isVideoMode}
          onToggleVideoMode={toggleVideoMode}
        />
      </div>
    </ThemeProvider>
  )
}
