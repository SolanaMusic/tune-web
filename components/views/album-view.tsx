"use client";

import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  Heart,
  Share2,
  MoreHorizontal,
  Clock,
  Calendar,
  Music,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ViewType } from "@/components/music-app";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";

interface AlbumViewProps {
  id: string | null;
  onNavigate?: (view: ViewType, id?: string) => void;
}

export function AlbumView({ id, onNavigate }: AlbumViewProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [album, setAlbum] = useState();
  const [moreAlbums, setMoreAlbums] = useState();
  const [playingTrackId, setPlayingTrackId] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const albumsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}albums/${id}`
        );
        setAlbum(albumsResponse.data);

        const moreAlbumsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}albums/by-artist/${albumsResponse.data.artists[0].id}`
        );
        setMoreAlbums(moreAlbumsResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const formatDuration = (duration: string) => {
    const parts = duration.split(":");
    return `${parts[1]}:${parts[2]}`;
  };

  const getTotalDuration = () => {
    let totalSeconds = album.tracks.reduce((sum, track) => {
      const parts = track.duration.split(":").map(Number);

      let seconds = 0;
      if (parts.length === 3) {
        seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      } else if (parts.length === 2) {
        seconds = parts[0] * 60 + parts[1];
      } else if (parts.length === 1) {
        seconds = parts[0];
      }

      return sum + seconds;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours > 0 ? hours + " hr " : ""}${minutes} min ${seconds} sec`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handlePlayAlbum = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlayTrack = (trackId: string) => {
    setPlayingTrackId(trackId === playingTrackId ? null : trackId);
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
    <div className="flex flex-col">
      <div className="bg-gradient-to-b from-primary/10 to-background p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
            <img
              src={
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${album.imageUrl}` ||
                "/placeholder.svg"
              }
              alt={album.title}
              className="h-full w-full object-cover"
            />
            {album.nftCollection && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary text-primary-foreground">
                  NFT
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left flex-1">
            <div className="text-sm font-medium uppercase">Album</div>
            <h1 className="mt-1 text-3xl font-bold md:text-5xl">
              {album.title}
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-2 cursor-pointer flex-wrap">
                {album.artists.map((artist, index) => (
                  <div
                    key={artist.id}
                    className="flex items-center gap-2"
                    onClick={() => router.push(`/artists/${artist.id}`)}
                  >
                    <img
                      src={
                        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${artist.imageUrl}` ||
                        "/placeholder.svg"
                      }
                      alt={artist.name}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                    <span className="font-medium hover:underline">
                      {artist.name}
                      {index < album.artists.length - 1 && ","}
                    </span>
                  </div>
                ))}
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {new Date(album.releaseDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {album.tracks.length} tracks,
              </span>
              <span className="text-muted-foreground">
                {getTotalDuration()}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="rounded-full" onClick={handlePlayAlbum}>
                {isPlaying ? (
                  <>
                    <Pause className="mr-1 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-1 h-5 w-5 fill-primary-foreground" />
                    Play
                  </>
                )}
              </Button>
              <Button
                variant={isLiked ? "default" : "outline"}
                size="icon"
                className="rounded-full"
                onClick={handleLike}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked ? "fill-primary-foreground" : ""
                  }`}
                />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {album.nftCollection && (
            <div className="w-full md:w-96 mt-6 md:mt-0">
              {" "}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">
                      Exclusive NFT Collection
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="w-4 h-4" />
                        <span>Floor Price</span>
                      </div>
                      <div className="font-bold text-lg">
                        {album.nftCollection.price}{" "}
                        {album.nftCollection.currency.symbol}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>Availability</span>
                        </div>
                        <span className="font-medium">
                          {album.nftCollection.minted} of{" "}
                          {album.nftCollection.supply} left
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (album.nftCollection.minted /
                                album.nftCollection.supply) *
                              100
                            }%`,
                          }}
                        />
                      </div>

                      <div className="text-xs text-muted-foreground text-center">
                        {(
                          (album.nftCollection.minted /
                            album.nftCollection.supply) *
                          100
                        ).toFixed(1)}
                        % minted
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                      disabled={
                        album.nftCollection.minted >= album.nftCollection.supply
                      }
                      onClick={() =>
                        router.push(
                          `/nft-marketplace/collection/${album.nftCollection.id}`
                        )
                      }
                    >
                      {album.nftCollection.minted >=
                      album.nftCollection.supply ? (
                        <>
                          <Tag className="w-4 h-4" />
                          Sold Out
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Mint NFT
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="space-y-10">
          <section>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Plays</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Clock className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {album.tracks.map((track, index) => (
                  <TableRow
                    key={track.id}
                    className={`group hover:bg-accent/20 ${
                      playingTrackId === track.id
                        ? "bg-gradient-to-b from-primary/10 to-background p-6 md:p-8"
                        : ""
                    }`}
                  >
                    <TableCell className="text-center font-medium text-muted-foreground">
                      <div className="relative flex items-center justify-center group">
                        <span
                          className={`transition-opacity ${
                            playingTrackId === track.id
                              ? "opacity-0"
                              : "opacity-100 group-hover:opacity-0"
                          }`}
                        >
                          {index + 1}
                        </span>

                        {playingTrackId === track.id && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse group-hover:hidden"></div>
                        )}

                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayTrack(track.id);
                          }}
                        >
                          {playingTrackId === track.id ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <div
                            className="flex items-center gap-1 font-medium cursor-pointer"
                            onClick={() => router.push(`/tracks/${track.id}`)}
                          >
                            {track.title}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {track.playsCount}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDuration(track.duration)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-xl font-bold">About</h2>
              <p className="text-muted-foreground">{album.description}</p>

              <div className="flex items-start gap-2 pt-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Release Date</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(album.releaseDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Genres</div>
                  <div className="text-sm text-muted-foreground">
                    {album.genres.map((g) => g.name).join(", ")}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold">
                More by {album.artists[0].name}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {moreAlbums.map((album) => (
                  <div
                    key={album.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent"
                    onClick={() => router.push(`/albums/${album?.id}`)}
                  >
                    <img
                      src={
                        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${album.imageUrl}` ||
                        "/placeholder.svg"
                      }
                      alt={album.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium line-clamp-1">
                        {album.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(album.releaseDate).getFullYear()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
