"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize2,
  Minimize2,
  Repeat,
  Shuffle,
  VolumeX,
  Heart,
  Plus,
  Share2,
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
import { useToast } from "@/hooks/use-toast";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number;
  isPlaying: boolean;
}

interface PlayerProps {
  track: Track;
  onTogglePlay: () => void;
  isVideoMode: boolean;
  onToggleVideoMode: () => void;
}

export function Player({
  track,
  onTogglePlay,
  isVideoMode,
  onToggleVideoMode,
}: PlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn);
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Liked Songs" : "Added to Liked Songs",
      description: `"${track.title}" by ${track.artist} has been ${
        isLiked ? "removed from" : "added to"
      } your Liked Songs.`,
      duration: 3000,
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/track/${track.id}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to "${track.title}" by ${track.artist} has been copied to clipboard.`,
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Sharing Failed",
          description: "Could not copy link to clipboard.",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  const userPlaylists = [
    { id: "p1", name: "My Summer Mix", tracks: 24 },
    { id: "p2", name: "Indie Discoveries", tracks: 42 },
    { id: "p3", name: "Coding Focus", tracks: 18 },
    { id: "p4", name: "Throwback Jams", tracks: 36 },
    { id: "p5", name: "Chill Evening", tracks: 15 },
    { id: "p6", name: "Workout Motivation", tracks: 28 },
  ];

  const addToPlaylist = (playlistId: string, playlistName: string) => {
    toast({
      title: "Added to Playlist",
      description: `"${track.title}" has been added to ${playlistName}.`,
      duration: 3000,
    });
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-card transition-all duration-300",
        isVideoMode && !isFullscreen ? "h-64" : "h-20",
        isVideoMode && isFullscreen ? "h-screen" : ""
      )}
      style={{ paddingBottom: 100 }}
    >
      <div className="flex h-full flex-col" style={{ paddingTop: 10 }}>
        {isVideoMode && (
          <div className="relative flex-1 bg-black">
            <div className="flex h-full items-center justify-center">
              <img
                src={track.cover || "/placeholder.svg"}
                alt={track.title}
                className="h-full w-auto max-w-full object-contain"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 bg-black/50 text-white hover:bg-black/70"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
          </div>
        )}

        <div className="flex h-20 items-center px-4">
          <div className="flex w-1/4 items-center gap-3">
            <img
              src={track.cover || "/placeholder.svg"}
              alt={track.title}
              className="h-12 w-12 rounded-md object-cover"
            />
            <div className="hidden sm:block">
              <div className="font-medium line-clamp-1">{track.title}</div>
              <div className="text-sm text-muted-foreground line-clamp-1">
                {track.artist}
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
                onClick={onTogglePlay}
              >
                {track.isPlaying ? (
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
                className={cn("hidden sm:flex", isRepeatOn && "text-primary")}
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
                max={track.duration}
                step={1}
                onValueChange={(value) => setCurrentTime(value[0])}
                className="flex-1"
              />
              <div className="text-xs text-muted-foreground">
                {formatTime(track.duration)}
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
              <PopoverContent align="end" className="w-64 p-0">
                <div className="p-3 font-medium">Add to playlist</div>
                <ScrollArea className="h-60">
                  <div className="space-y-1 p-2">
                    {userPlaylists.map((playlist) => (
                      <Button
                        key={playlist.id}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() =>
                          addToPlaylist(playlist.id, playlist.name)
                        }
                      >
                        {playlist.name}
                        <span className="ml-auto text-xs text-muted-foreground">
                          {playlist.tracks}
                        </span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={handleShare}>
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
                onValueChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
