"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  VolumeX,
  Heart,
  Plus,
  Share2,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePlayerStore } from "@/stores/PlayerStore";
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";
import { useRouter } from "next/navigation";

export function Player() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    isMuted,
    isRepeat,
    togglePlay,
    setVolume,
    setCurrentTime,
    toggleMute,
    toggleRepeat,
  } = usePlayerStore();

  const router = useRouter();
  const { user } = useUserStore();
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        if (user) {
          const playlistsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/get-user-playlists/${user.id}`
          );
          setPlaylists(playlistsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchPlaylists();
  }, [user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const addOrRemoveFromPlaylist = async (playlistId: number) => {
    if (!currentTrack) return;
    const playlist = playlists.find((p) => p.id === playlistId);

    if (!playlist) return;
    const isInPlaylist = playlist.tracks.some((t) => t.id === currentTrack.id);

    try {
      if (isInPlaylist) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/remove-from-playlist`,
          { params: { playlistId, trackId: currentTrack.id } }
        );
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? {
                  ...p,
                  tracks: p.tracks.filter((t) => t.id !== currentTrack.id),
                }
              : p
          )
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/add-to-playlist`,
          { playlistId, trackId: currentTrack.id }
        );
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: [...p.tracks, currentTrack] }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to update playlist", error);
    }
  };

  if (!currentTrack) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-card transition-all duration-300 h-20"
      )}
      style={{ paddingBottom: 100 }}
    >
      <div className="flex h-full flex-col" style={{ paddingTop: 10 }}>
        <div className="flex h-20 items-center px-4">
          <div className="flex w-1/4 items-center gap-3">
            <img
              src={
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${currentTrack.cover}` ||
                "/placeholder.svg"
              }
              alt={currentTrack.title}
              className="h-12 w-12 rounded-md object-cover"
            />
            <div className="hidden sm:block">
              <div className="font-medium line-clamp-1">
                {currentTrack.title}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {currentTrack.artists?.length
                  ? currentTrack.artists.map((artist, index) => (
                      <span key={artist.id}>
                        <span
                          onClick={() => router.push(`/artists/${artist.id}`)}
                          className="cursor-pointer hover:underline"
                        >
                          {artist.name}
                        </span>
                        {index < currentTrack.artists.length - 1 && ", "}
                      </span>
                    ))
                  : "Unknown"}
              </div>
            </div>
          </div>

          <div className="flex w-2/4 flex-col items-center gap-1">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className={cn("hidden sm:flex", isShuffleOn && "text-primary")}
                onClick={toggleShuffle}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 pl-0.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn("hidden sm:flex", isRepeat && "text-primary")}
                onClick={toggleRepeat}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex w-full max-w-md items-center gap-2">
              <div className="text-xs text-muted-foreground">
                {formatTime(currentTime)}
              </div>
              <Slider
                value={[currentTime]}
                max={currentTrack.duration}
                step={1}
                onValueChange={(value) => setCurrentTime(value[0])}
                className="flex-1"
              />
              <div className="text-xs text-muted-foreground">
                {formatTime(currentTrack.duration)}
              </div>
            </div>
          </div>

          <div className="flex w-1/4 items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(isLiked && "text-primary")}
              onClick={toggleLike}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-primary")} />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Plus className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-64 p-0">
                <div className="p-3 font-medium border-b">Add to playlist</div>
                <ScrollArea className="h-60">
                  {user && (
                    <div className="space-y-1 p-2">
                      {playlists.map((playlist) => (
                        <Button
                          key={playlist.id}
                          variant="ghost"
                          className="w-full justify-start h-12 group relative"
                          onClick={() => addOrRemoveFromPlaylist(playlist.id)}
                        >
                          <div className="w-10 h-10 rounded mr-3 flex items-center justify-center overflow-hidden bg-muted relative">
                            <img
                              src={
                                playlist.coverUrl
                                  ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${playlist.coverUrl}`
                                  : "/placeholder.svg"
                              }
                              alt={playlist.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                              {playlist.tracks.some(
                                (t) => t.id === currentTrack.id
                              ) ? (
                                <Minus className="h-4 w-4 text-white" />
                              ) : (
                                <Plus className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{playlist.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {playlist.tracks.length} tracks
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>

            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={(value) => {
                  const newVolume = value[0];
                  if (isMuted && newVolume > 0) {
                    toggleMute();
                  }

                  setVolume(newVolume);
                }}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
