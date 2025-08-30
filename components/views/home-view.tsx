"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

export function HomeView() {
  const router = useRouter();
  const { user } = useUser();
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  const [artists, setArtists] = useState<[]>([]);
  const [albums, setAlbums] = useState<[]>([]);
  const [tracks, setTracks] = useState<[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePlayItem = (type: string, id: number) => {
    const itemKey = `${type}-${id}`;
    setPlayingItem(playingItem === itemKey ? null : itemKey);
  };

  const navigateTo = (path: string, id: number) => {
    router.push(`/${path}/${id}`);
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [artistsRes, albumsRes, tracksRes, recRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}artists`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}albums`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}tracks`),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/recently-played/${
              user?.id || 0
            }`
          ),
        ]);

        setArtists(artistsRes.data);
        setAlbums(albumsRes.data);
        setTracks(tracksRes.data);
        setRecentlyPlayed(recRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
  }, []);

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
    <div className="space-y-8 p-6">
      <section>
        <h2 className="mb-4 text-2xl font-bold">Popular Artists</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group cursor-pointer"
              onClick={() => navigateTo("artists", artist.id)}
            >
              <div className="overflow-hidden rounded-full aspect-square">
                <img
                  src={
                    `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${artist.imageUrl}` ||
                    "/placeholder.svg"
                  }
                  alt={artist.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-2 text-center">
                <h3 className="font-semibold line-clamp-1">{artist.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Featured Albums</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="group cursor-pointer transition-all hover:bg-accent"
              onClick={() => navigateTo("albums", album.id)}
            >
              <CardContent className="p-3">
                <div className="relative overflow-hidden rounded-md aspect-square">
                  <img
                    src={
                      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${album.imageUrl}` ||
                      "/placeholder.svg"
                    }
                    alt={album.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayItem("playlist", album.id);
                      }}
                    >
                      {playingItem === `playlist-${album.id}` ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold line-clamp-1">{album.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {album.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Trending Now</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="group cursor-pointer transition-all hover:bg-accent"
              onClick={() => navigateTo("tracks", track.id)}
            >
              <CardContent className="p-3">
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={
                      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.imageUrl}` ||
                      "/placeholder.svg"
                    }
                    alt={track.title}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayItem("trending", track.id);
                      }}
                    >
                      {playingItem === `trending-${track.id}` ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold line-clamp-1">{track.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {track.artist}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Recently Played</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {recentlyPlayed.map((track) => (
            <Card
              key={track.id}
              className="group cursor-pointer transition-all hover:bg-accent"
              onClick={() => navigateTo("tracks", track.id)}
            >
              <CardContent className="p-3">
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={
                      `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.imageUrl}` ||
                      "/placeholder.svg"
                    }
                    alt={track.title}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayItem("track", track.id);
                      }}
                    >
                      {playingItem === `track-${track.id}` ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold line-clamp-1">{track.title}</h3>
                  <p
                    className="text-sm text-muted-foreground line-clamp-1 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToArtist("a1");
                    }}
                  >
                    {track.artist}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
