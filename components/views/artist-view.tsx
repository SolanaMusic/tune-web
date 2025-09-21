"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  MoreHorizontal,
  Heart,
  Share2,
  CheckCircle,
  Loader2,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useUserStore } from "@/stores/UserStore";
import { usePlayerStore } from "@/stores/PlayerStore";

export function ArtistView({ id }: { id: number }) {
  const router = useRouter();
  const { user } = useUserStore();
  const { currentTrack, isPlaying, togglePlay, playOrToggle } =
    usePlayerStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribers, setSubscribers] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showMoreTracks, setShowMoreTracks] = useState(false);
  const [artist, setArtist] = useState();
  const [artists, setArtists] = useState<any>([]);
  const [nfts, setNfts] = useState<any>([]);
  const [playlists, setPlaylists] = useState<any>([]);
  const [bgGradient, setBgGradient] = useState(
    "linear-gradient(to bottom, #000, #000)"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = user ? { userId: user.id } : undefined;

        const artistResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}artists/${id}`,
          { params }
        );

        setArtist(artistResponse.data);
        setIsSubscribed(artistResponse.data.isUserSubscribed);
        setSubscribers(artistResponse.data.subscribersCount);

        if (artistResponse.data.imageUrl) {
          import("fast-average-color").then((module) => {
            const fac = new module.FastAverageColor();
            fac
              .getColorAsync(
                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${artistResponse.data.imageUrl}`
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

        const artistsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}artists`,
          { params }
        );

        setArtists(
          artistsResponse.data.filter((x) => x.id !== artistResponse.data.id)
        );

        const nftsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/artist-collections/${id}`,
          {
            params: user?.id ? { userId: user.id } : {},
          }
        );

        setNfts(nftsResponse.data);

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

  const handlePlayTrack = (
    id: number,
    title: string,
    duration: string,
    cover: string,
    artists: []
  ) => {
    const trackState = {
      id,
      title,
      artists: artists.map((a) => ({ id: a.id, name: a.name })),
      cover: cover || "/placeholder.svg",
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

  const handlePlayPopular = () => {
    if (!artist.tracks || artist.tracks.length === 0) return;

    if (currentTrack && artist.tracks.some((t) => t.id === currentTrack.id)) {
      togglePlay();
    } else {
      const first = artist.tracks[0];
      handlePlayTrack(
        first.id,
        first.title,
        first.duration,
        first.imageUrl,
        first.artists
      );
    }
  };

  const addOrRemoveFromPlaylist = async (
    playlistId: number,
    trackId: number,
    track: any
  ) => {
    const playlist = playlists.find((p) => p.id === playlistId);
    if (!playlist) return;
    const isInPlaylist = playlist.tracks.some((t) => t.id === trackId);

    try {
      if (isInPlaylist) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/remove-from-playlist`,
          { params: { playlistId, trackId } }
        );
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === playlistId
              ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
              : p
          )
        );
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/add-to-playlist`,
          { playlistId, trackId }
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

  const handleSubscribe = async () => {
    if (!user || !artist) return;

    const url = !isSubscribed
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}artists/subscribe-to-artist`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}artists/unsubscribe-from-artist`;

    const method = !isSubscribed ? "post" : "delete";
    const config =
      method === "post"
        ? { id, userId: user.id }
        : { params: { id, userId: user.id } };

    try {
      await axios[method](url, config);
      setIsSubscribed(!isSubscribed);
      setSubscribers((prev) => prev + (!isSubscribed ? 1 : -1));
    } catch (error) {
      console.error("Failed to update subscription", error);
    }
  };

  const getAlbumByTrackId = (trackId: number) => {
    if (!artist?.albums?.length) return null;

    return (
      artist.albums.find((album) =>
        album.tracks.some((t) => t.id === trackId)
      ) || null
    );
  };

  const handleLike = async (collectionId: string, liked: boolean) => {
    if (!user) return;

    setNfts((prev) =>
      prev.map((item) =>
        item.id === collectionId ? { ...item, isLiked: !liked } : item
      )
    );

    try {
      if (!liked) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/liked`, {
          userId: user.id,
          collectionId,
        });
      } else {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/liked/${collectionId}?type=collection`
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setNfts((prev) =>
        prev.map((item) =>
          item.id === collectionId ? { ...item, isLiked: liked } : item
        )
      );
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
    <div className="flex flex-col">
      <div
        className="relative flex flex-col bg-gradient-to-b from-primary/30 to-background pb-10"
        style={{
          background: bgGradient,
        }}
      >
        <div className="container mx-auto px-6 pt-8 md:pt-16">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
            <div className="h-40 w-40 flex-shrink-0 overflow-hidden rounded-full border-4 border-background shadow-lg md:h-48 md:w-48">
              <img
                src={
                  artist.imageUrl
                    ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${artist.imageUrl}`
                    : "/placeholder.svg"
                }
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold md:text-5xl">
                  {artist.name}
                </h1>
                {artist.user.profile && (
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{subscribers} subscribers</span>
                <span>•</span>
                <span>
                  {artist.tracks.reduce((acc, x) => acc + x.playsCount, 0)}{" "}
                  listens
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 flex-nowrap overflow-x-auto">
                <Button className="rounded-full" onClick={handlePlayPopular}>
                  {isPlaying &&
                  artist.tracks.some((t) => t.id === currentTrack?.id) ? (
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
                  variant={isSubscribed ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => handleSubscribe()}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-primary text-primary" : ""
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 p-0">
                    <div className="p-1">
                      <Button variant="ghost" className="w-full justify-start">
                        Report Artist
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Block Artist
                      </Button>
                      <Button variant="ghost" className="w-full justify-start">
                        Add to Library
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="discography">Discography</TabsTrigger>
            <TabsTrigger value="nfts">NFTs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            {artist.tracks.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold">Popular</h2>
                <div className="grid gap-3">
                  {artist.tracks
                    .slice(0, showMoreTracks ? 10 : 5)
                    .map((track) => {
                      const album = getAlbumByTrackId(track.id);
                      return (
                        <div
                          key={track.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group hover:bg-accent cursor-pointer
                            ${
                              currentTrack?.id === track.id && isPlaying
                                ? "bg-accent/50"
                                : ""
                            }
                            ${
                              currentTrack?.id === track.id && !isPlaying
                                ? "bg-accent/25 hover:bg-accent/50"
                                : ""
                            }
                            ${
                              !currentTrack?.id === track.id
                                ? "hover:bg-muted/50"
                                : ""
                            }
                          `}
                          onClick={() => router.push(`/tracks/${track.id}`)}
                        >
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={
                                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.imageUrl}` ||
                                "/placeholder.svg"
                              }
                              alt={track.title}
                              className="h-full w-full object-cover"
                            />
                            <div
                              className={`absolute inset-0 bg-black/40 rounded-md flex items-center justify-center transition-opacity ${
                                currentTrack?.id === track.id && isPlaying
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayTrack(
                                  track.id,
                                  track.title,
                                  track.duration,
                                  track.imageUrl,
                                  track.artists
                                );
                              }}
                            >
                              <div className="relative group h-6 w-6 flex items-center justify-center">
                                {currentTrack?.id === track.id && isPlaying ? (
                                  <>
                                    <div className="h-3 w-3 animate-pulse rounded-full bg-white group-hover:hidden"></div>
                                    <Pause className="h-5 w-5 text-white hidden group-hover:flex" />
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-5 w-5 text-white hidden group-hover:flex" />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 font-medium truncate">
                              {track.title}
                            </div>
                            <div
                              className="text-sm text-muted-foreground truncate cursor-pointer hover:underline"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/albums/${album?.id}`);
                              }}
                            >
                              {album?.title}
                            </div>
                          </div>
                          <div className="flex space-x-4">
                            <div className="text-sm text-muted-foreground hidden md:block">
                              {track.playsCount}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {formatDuration(track.duration)}
                            </div>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-56 p-0">
                              <div className="p-1">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  Add to Liked Songs
                                </Button>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-between"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Add to Playlist
                                      <span>▶</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="start"
                                    className="w-64 p-0"
                                  >
                                    <div className="p-3 font-medium border-b">
                                      Add to playlist
                                    </div>
                                    <ScrollArea className="h-60">
                                      {user && (
                                        <div className="space-y-1 p-2">
                                          {playlists.map((playlist) => (
                                            <Button
                                              key={playlist.id}
                                              variant="ghost"
                                              className="w-full justify-start h-12 group relative"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                addOrRemoveFromPlaylist(
                                                  playlist.id,
                                                  track.id,
                                                  track
                                                );
                                              }}
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
                                                    (t) => t.id === track.id
                                                  ) ? (
                                                    <Minus className="h-4 w-4 text-white" />
                                                  ) : (
                                                    <Plus className="h-4 w-4 text-white" />
                                                  )}
                                                </div>
                                              </div>
                                              <div className="text-left">
                                                <div className="font-medium">
                                                  {playlist.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {playlist.tracks.length}{" "}
                                                  tracks
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
                                  className="w-full justify-start"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Share
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() =>
                                    router.push(`/albums/${track.albumId}`)
                                  }
                                >
                                  Go to Album
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      );
                    })}
                </div>
                {artist.tracks.length > 5 && (
                  <Button
                    variant="link"
                    className="mt-2 px-2"
                    onClick={() => setShowMoreTracks(!showMoreTracks)}
                  >
                    {showMoreTracks ? "Show less" : "See more"}
                  </Button>
                )}
              </section>
            )}

            {artist.albums.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold">Albums</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {artist.albums.map((album) => (
                    <Card
                      key={album.id}
                      className="group cursor-pointer transition-all hover:bg-accent"
                      onClick={() => router.push(`/albums/${album.id}`)}
                    >
                      <CardContent className="p-3">
                        <div className="relative overflow-hidden rounded-md">
                          <img
                            src={
                              `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${album.imageUrl}` ||
                              "/placeholder.svg"
                            }
                            alt={album.title}
                            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-12 w-12 rounded-full"
                            >
                              <Play className="h-6 w-6" />
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="font-semibold line-clamp-1">
                            {album.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(album.releaseDate).getFullYear()} •{" "}
                            {album.tracks.length} tracks
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="mb-6 text-2xl font-bold">Fans might also like</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {artists.map((artist) => (
                  <div
                    key={artist.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/artists/${artist.id}`)}
                  >
                    <div className="overflow-hidden rounded-full">
                      <img
                        src={
                          artist.imageUrl
                            ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${artist.imageUrl}`
                            : "/placeholder.svg"
                        }
                        alt={artist.name}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <h3 className="font-semibold line-clamp-1">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {artist.subscribersCount} followers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="discography">
            <div className="space-y-8">
              {artist.albums.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-bold">All Albums</h2>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {artist.albums.map((album) => (
                      <Card
                        key={album.id}
                        className="group cursor-pointer transition-all hover:bg-accent"
                        onClick={() => router.push(`/albums/${album.id}`)}
                      >
                        <CardContent className="p-3">
                          <div className="relative overflow-hidden rounded-md">
                            <img
                              src={
                                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${album.imageUrl}` ||
                                "/placeholder.svg"
                              }
                              alt={album.title}
                              className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-12 w-12 rounded-full"
                              >
                                <Play className="h-6 w-6" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <h3 className="font-semibold line-clamp-1">
                              {album.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(album.releaseDate).getFullYear()}•{" "}
                              {album.tracks.length} tracks
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {artist.tracks.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-bold">All Tracks</h2>
                  <div className="grid gap-3">
                    {artist.tracks.map((track) => {
                      const album = getAlbumByTrackId(track.id);
                      return (
                        <div
                          key={track.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group hover:bg-accent cursor-pointer
                            ${
                              currentTrack?.id === track.id && isPlaying
                                ? "bg-accent/50"
                                : ""
                            }
                            ${
                              currentTrack?.id === track.id && !isPlaying
                                ? "bg-accent/25 hover:bg-accent/50"
                                : ""
                            }
                            ${
                              !currentTrack?.id === track.id
                                ? "hover:bg-muted/50"
                                : ""
                            }
                          `}
                          onClick={() => router.push(`/tracks/${track.id}`)}
                        >
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={
                                `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.imageUrl}` ||
                                "/placeholder.svg"
                              }
                              alt={track.title}
                              className="h-full w-full object-cover"
                            />
                            <div
                              className={`absolute inset-0 bg-black/40 rounded-md flex items-center justify-center transition-opacity ${
                                currentTrack?.id === track.id && isPlaying
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayTrack(
                                  track.id,
                                  track.title,
                                  track.duration,
                                  track.imageUrl,
                                  track.artists
                                );
                              }}
                            >
                              <div className="relative group h-6 w-6 flex items-center justify-center">
                                {currentTrack?.id === track.id && isPlaying ? (
                                  <>
                                    <div className="h-3 w-3 animate-pulse rounded-full bg-white group-hover:hidden"></div>
                                    <Pause className="h-5 w-5 text-white hidden group-hover:flex" />
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-5 w-5 text-white hidden group-hover:flex" />
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 font-medium truncate">
                              {track.title}
                            </div>
                            <div
                              className="text-sm text-muted-foreground truncate cursor-pointer hover:underline"
                              onClick={(e) => {
                                e.stopPropagation;
                                router.push(`/albums/${album?.id}`);
                              }}
                            >
                              {album?.title}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground hidden md:block">
                            {track.playsCount}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDuration(track.duration)}
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-56 p-0">
                              <div className="p-1">
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                >
                                  Add to Liked Songs
                                </Button>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="w-full justify-between"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Add to Playlist
                                      <span>▶</span>
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    align="start"
                                    className="w-64 p-0"
                                  >
                                    <div className="p-3 font-medium border-b">
                                      Add to playlist
                                    </div>
                                    <ScrollArea className="h-60">
                                      {user && (
                                        <div className="space-y-1 p-2">
                                          {playlists.map((playlist) => (
                                            <Button
                                              key={playlist.id}
                                              variant="ghost"
                                              className="w-full justify-start h-12 group relative"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                addOrRemoveFromPlaylist(
                                                  playlist.id,
                                                  track.id,
                                                  track
                                                );
                                              }}
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
                                                    (t) => t.id === track.id
                                                  ) ? (
                                                    <Minus className="h-4 w-4 text-white" />
                                                  ) : (
                                                    <Plus className="h-4 w-4 text-white" />
                                                  )}
                                                </div>
                                              </div>
                                              <div className="text-left">
                                                <div className="font-medium">
                                                  {playlist.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {playlist.tracks.length}{" "}
                                                  tracks
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
                                  className="w-full justify-start"
                                >
                                  Share
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start"
                                  onClick={() =>
                                    router.push(`/albums/${track.albumId}`)
                                  }
                                >
                                  Go to Album
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nfts">
            <div className="space-y-8">
              {nfts.length > 0 && (
                <section>
                  <h2 className="mb-6 text-2xl font-bold">Artist NFTs</h2>
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
                    {nfts.map((nft) => (
                      <Card
                        key={nft.id}
                        className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                        onClick={() =>
                          router.push(`/nft-marketplace/collection/${nft.id}`)
                        }
                      >
                        <div className="relative">
                          <img
                            src={nft.imageUrl || "/placeholder.svg"}
                            alt={nft.name}
                            className="aspect-square w-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary/80 text-primary-foreground">
                              {nft.associationType} Collection
                            </Badge>
                          </div>
                          <div className="absolute bottom-2 right-2 flex gap-1">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(nft.id, nft.isLiked);
                              }}
                            >
                              <Heart
                                className={`h-5 w-5 ${
                                  nft.isLiked ? "fill-primary text-primary" : ""
                                }`}
                              />
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold line-clamp-1 text-sm">
                            {nft.name}
                          </h3>

                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">
                                {nft.price} {nft.currency.symbol} Floor
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {nft.minted}/{nft.supply}
                            </div>
                          </div>

                          <div className="mt-3 w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(nft.minted / nft.supply) * 100}%`,
                              }}
                            ></div>
                          </div>

                          <Button
                            className="w-full mt-4"
                            disabled={nft.minted >= nft.supply}
                          >
                            {nft.minted >= nft.supply ? "Sold Out" : "Mint NFT"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
