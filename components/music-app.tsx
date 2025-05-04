"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { HomeView } from "@/components/views/home-view"
import { PlaylistView } from "@/components/views/playlist-view"
import { ProfileView } from "@/components/views/profile-view"
import { ArtistView } from "@/components/views/artist-view"
import { AlbumView } from "@/components/views/album-view"
import { SubscriptionView } from "@/components/views/subscription-view"
import { AdminDashboardView } from "@/components/views/admin-dashboard-view"

export type ViewType =
  | "home"
  | "explore"
  | "library"
  | "playlist"
  | "profile"
  | "artist"
  | "album"
  | "subscription"
  | "admin"

export function MusicApp() {
  const [currentView, setCurrentView] = useState<ViewType>("home")
  const [currentPlaylist, setCurrentPlaylist] = useState<string | null>(null)
  const [currentArtistId, setCurrentArtistId] = useState<string | null>(null)
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null)

  const handleNavigation = (view: ViewType, id?: string) => {
    setCurrentView(view)
    if (id) {
      if (view === "playlist") {
        setCurrentPlaylist(id)
      } else if (view === "artist") {
        setCurrentArtistId(id)
      } else if (view === "album") {
        setCurrentAlbumId(id)
      }
    }
  }

  return (
    <Layout onNavigate={handleNavigation}>
      {currentView === "home" && <HomeView onNavigate={handleNavigation} />}
      {currentView === "playlist" && <PlaylistView id={currentPlaylist} />}
      {currentView === "profile" && <ProfileView onNavigate={handleNavigation} />}
      {currentView === "artist" && <ArtistView id={currentArtistId} onNavigate={handleNavigation} />}
      {currentView === "album" && <AlbumView id={currentAlbumId} onNavigate={handleNavigation} />}
      {currentView === "subscription" && <SubscriptionView onNavigate={handleNavigation} />}
      {currentView === "admin" && <AdminDashboardView />}
    </Layout>
  )
}
