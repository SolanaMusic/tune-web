"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Heart,
  Share2,
  Plus,
  Minus,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { useUser } from "@/context/UserContext";

export function TrackView({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [track, setTrack] = useState<any>();
  const [related, setRelated] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(to bottom, #000, #000)"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trackResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/${id}`
        );
        setTrack(trackResponse.data);

        if (trackResponse.data.imageUrl) {
          import("fast-average-color").then((module) => {
            const fac = new module.FastAverageColor();
            fac
              .getColorAsync(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${trackResponse.data.imageUrl}`
              )
              .then((color) => {
                setBgGradient(`
                    linear-gradient(
                        180deg,
                        ${shadeColor(color.hex, +20)} 0%, 
                        ${color.hex} 50%, 
                        ${shadeColor(color.hex, -70)} 100%
                    )
                `);
              })
              .catch(() => {
                setBgGradient("linear-gradient(to bottom, #000, #000)");
              });
          });
        }

        const relatedResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/by-artist/${trackResponse.data.artists[0].id}`
        );
        setRelated(relatedResponse.data);

        if (user) {
          const playlistsResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/get-user-playlists/${user.id}`
          );
          setPlaylists(playlistsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  function shadeColor(color: string, percent: number) {
    const f = parseInt(color.slice(1), 16),
      t = percent < 0 ? 0 : 255,
      p = Math.abs(percent) / 100,
      R = f >> 16,
      G = (f >> 8) & 0x00ff,
      B = f & 0x0000ff;
    return (
      "#" +
      (
        0x1000000 +
        (Math.round((t - R) * p) + R) * 0x10000 +
        (Math.round((t - G) * p) + G) * 0x100 +
        (Math.round((t - B) * p) + B)
      )
        .toString(16)
        .slice(1)
    );
  }

  const addOrRemoveFromPlaylist = async (playlistId: number) => {
    if (!track) return;
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;
    const isInPlaylist = playlist.tracks.some((t) => t.id === track.id);

    try {
      if (isInPlaylist) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/remove-from-playlist`,
          { params: { playlistId, trackId: track.id } }
        );
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter((t) => t.id !== track.id) }
              : p
          )
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/add-to-playlist`,
          { playlistId, trackId: track.id }
        );
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId ? { ...p, tracks: [...p.tracks, track] } : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to update playlist", error);
    }
  };

  const formatDuration = (duration: string) => {
    const parts = duration.split(":");
    return `${parts[1]}:${parts[2]}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="translate-y-[-70px]">
          <Loader2 className="h-20 w-20 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div
        className="relative bg-gradient-to-b"
        style={{ background: bgGradient }}
      >
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="flex-shrink-0">
              <img
                src={
                  `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.imageUrl}` ||
                  "/placeholder.svg"
                }
                alt={track.title}
                className="w-60 h-60 rounded-lg shadow-2xl object-cover"
              />
            </div>

            <div className="flex-1 text-white pb-6">
              <p className="text-sm font-medium mb-2 opacity-90">Track</p>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {track.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm md:text-base opacity-90 pb-6">
                {track.artists.map((artist, index) => (
                  <span key={artist.id} className="flex items-center gap-1">
                    <img
                      src={
                        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${artist.imageUrl}` ||
                        "/placeholder.svg"
                      }
                      alt={artist.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <button
                      onClick={() => router.push(`/artists/${artist.id}`)}
                      className="font-medium hover:underline"
                    >
                      {artist.name}
                    </button>
                    {index < track.artists.length - 1 && ","}
                  </span>
                ))}

                {track.album && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() => router.push(`/albums/${track.album.id}`)}
                      className="hover:underline"
                    >
                      {track.album.title}
                    </button>
                  </>
                )}

                <span>•</span>
                <span>
                  {new Date(track.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
                <span>•</span>
                <span>{formatDuration(track.duration)}</span>
                <span>•</span>
                <span>{track.playsCount} plays</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {track.genres.map((genre) => (
                  <Badge
                    key={genre.id}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-purple-900/20 to-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-6 mb-8">
            <Button
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              className="!p-0 rounded-full w-12 h-12 bg-primary hover:bg-primary/90 hover:scale-105 transition-all flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`rounded-full w-10 h-10 ${
                isLiked
                  ? "text-primary hover:text-primary/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-10 h-10 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-0">
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
                                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${playlist.coverUrl}` ||
                                "/placeholder.svg"
                              }
                              alt={playlist.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                              {playlist.tracks.some(
                                (t) => t.id === track.id
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

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 text-muted-foreground hover:text-foreground"
            >
              <Share2 className="h-6 w-6" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-10 h-10 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {track.album && (
                  <DropdownMenuItem
                    onClick={() => router.push(`/albums/${track.album.id}`)}
                  >
                    Go to album
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => router.push(`/artists/${track.artists[0].id}`)}
                >
                  Go to artist
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Add to queue</DropdownMenuItem>
                <DropdownMenuItem>Show credits</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {track.album && (
              <>
                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-xl font-bold mb-4">From the album</h2>
                  <Card className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div
                        className="flex items-center gap-4"
                        onClick={() => router.push(`/albums/${track.album.id}`)}
                      >
                        <img
                          src={
                            `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.album.imageUrl}` ||
                            "/placeholder.svg"
                          }
                          alt={track.album.title}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{track.album.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {track.artists.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
            <div>
              <h2 className="text-xl font-bold mb-4">
                More from {track.artists[0].name}
              </h2>
              <div className="space-y-2">
                {related.map((relatedTrack) => (
                  <div
                    key={relatedTrack.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                    onClick={() => router.push(`/tracks/${relatedTrack.id}`)}
                  >
                    <div className="relative">
                      <img
                        src={
                          `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${relatedTrack.imageUrl}` ||
                          "/placeholder.svg"
                        }
                        alt={relatedTrack.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                        {relatedTrack.title}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {relatedTrack.playsCount} plays
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDuration(relatedTrack.duration)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
