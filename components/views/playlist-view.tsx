"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  MoreHorizontal,
  Play,
  Pause,
  Heart,
  Share2,
  Music,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import Link from "next/link";
import { usePlayerStore } from "@/stores/PlayerStore";
import { useRouter } from "next/navigation";

export function PlaylistView({ id }: { id: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [playlist, setPlaylist] = useState();
  const [isLiked, setIsLiked] = useState(id === "liked");
  const router = useRouter();
  const { currentTrack, isPlaying, togglePlay, playOrToggle } =
    usePlayerStore();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/${id}`
        );
        setPlaylist(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlayTrack = (id: number, title: string, duration: string) => {
    var track = playlist.tracks.find((x) => x.id === id);

    const trackState = {
      id,
      title,
      artists: track.artists.map((a) => ({ id: a.id, name: a.name })),
      cover: playlist.coverUrl,
      duration: duration
        .split(":")
        .map(Number)
        .reduce((acc, val, i, arr) => {
          if (arr.length === 3) return acc + val * [3600, 60, 1][i];
          if (arr.length === 2) return acc + val * [60, 1][i];
          return val;
        }, 0),
    };

    playOrToggle(trackState);
  };

  const handlePlayPause = () => {
    if (!playlist.tracks.length === 0) return;

    if (currentTrack && playlist.tracks.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      const first = playlist.tracks[0];
      handlePlayTrack(first.id, first.title, first.duration);
    }
  };

  function formatDuration(tracks: { duration: string }[]): string {
    const totalSeconds = tracks.reduce((acc, track) => {
      const parts = track.duration.split(":").map(Number);
      let seconds = 0;

      if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        seconds = parts[0] * 60 + parts[1];
      }

      return acc + seconds;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(" ");
  }

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
    <div className="flex flex-col h-full">
      <div className="bg-gradient-to-b from-primary/10 to-background p-6 md:p-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 text-xl"
          onClick={() => router.push("/playlists")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Playlists
        </Button>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
            {id === "liked" ? (
              <div className="flex h-full w-full items-center justify-center bg-primary/20">
                <Heart className="h-32 w-32 text-primary" fill="currentColor" />
              </div>
            ) : (
              <img
                src={
                  playlist.coverUrl
                    ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${playlist.coverUrl}`
                    : "/placeholder.svg"
                }
                alt="Playlist Cover"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="text-sm font-medium uppercase">Playlist</div>
            <h1 className="mt-1 text-3xl font-bold md:text-5xl">
              {playlist.name}
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <span className="font-medium">
                Created by {playlist.owner.userName}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {playlist.tracks.length} songs,
              </span>
              <span className="text-muted-foreground">
                {formatDuration(playlist.tracks)}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                className="rounded-full"
                onClick={handlePlayPause}
                disabled={playlist.tracks.length === 0}
              >
                {playlist.tracks.length === 0 || !isPlaying ? (
                  <>
                    <Play className="mr-1 h-5 w-5 fill-primary-foreground" />
                    Play
                  </>
                ) : (
                  <>
                    <Pause className="mr-1 h-5 w-5" />
                    Pause
                  </>
                )}
              </Button>

              {id !== "liked" && (
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-primary-foreground" : ""
                    }`}
                  />
                </Button>
              )}
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Add to queue</DropdownMenuItem>
                  <DropdownMenuItem>Edit playlist</DropdownMenuItem>
                  <DropdownMenuItem>Download</DropdownMenuItem>
                  {id !== "liked" && (
                    <DropdownMenuItem>Delete playlist</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        {playlist.tracks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
                <TableHead className="text-right">
                  <Clock className="ml-auto h-4 w-4" />
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlist.tracks.map((track, index) => (
                <TableRow
                  key={track.id}
                  className={`group hover:bg-accent/20 ${
                    currentTrack?.id === track.id
                      ? "bg-gradient-to-b from-primary/10 to-background p-6 md:p-8"
                      : ""
                  }`}
                >
                  <TableCell className="text-center font-medium text-muted-foreground">
                    <div className="relative flex items-center justify-center group">
                      <span
                        className={`transition-opacity ${
                          currentTrack?.id === track.id && isPlaying
                            ? "opacity-0"
                            : "opacity-100 group-hover:opacity-0"
                        }`}
                      >
                        {index + 1}
                      </span>

                      {currentTrack?.id === track.id && isPlaying && (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse group-hover:hidden"></div>
                      )}

                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayTrack(
                            track.id,
                            track.title,
                            track.duration
                          );
                        }}
                      >
                        {currentTrack?.id === track.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/tracks/${track.id}`}
                      className="hover:underline"
                    >
                      {track.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {track.artists.map((artist, index) => (
                      <span key={artist.id}>
                        <Link
                          href={`/artists/${artist.id}`}
                          className="hover:underline"
                        >
                          {artist.name}
                        </Link>
                        {index < track.artists.length - 1 && ", "}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    {track.album ? (
                      <Link
                        href={`/albums/${track.album.id}`}
                        className="hover:underline"
                      >
                        {track.album.title}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Single</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {(() => {
                      const parts = track.duration.split(":").map(Number);
                      if (parts.length === 3) {
                        const [h, m, s] = parts;
                        return h > 0
                          ? `${h}:${m.toString().padStart(2, "0")}:${s
                              .toString()
                              .padStart(2, "0")}`
                          : `${m}:${s.toString().padStart(2, "0")}`;
                      } else if (parts.length === 2) {
                        const [m, s] = parts;
                        return `${m}:${s.toString().padStart(2, "0")}`;
                      }
                      return track.duration;
                    })()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`${
                          id !== "liked"
                            ? "opacity-0 group-hover:opacity-100"
                            : ""
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            track.isLiked ? "fill-primary text-primary" : ""
                          }`}
                        />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Add to queue</DropdownMenuItem>
                          <DropdownMenuItem>Share</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Music className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No tracks found</h3>
            <p className="mb-6 text-muted-foreground">
              {id === "liked"
                ? "You haven't liked any songs yet. Start exploring to find songs you love!"
                : "This playlist is empty. Start adding some tracks!"}
            </p>
            <Button asChild>
              <Link href="/">Browse Music</Link>
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
