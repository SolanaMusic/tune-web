"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

export function HomeView() {
  const router = useRouter();
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  const featuredPlaylists = [
    {
      id: "1",
      title: "Discover Weekly",
      description: "Your weekly mixtape of fresh music",
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      title: "Release Radar",
      description: "Catch all the latest music from artists you follow",
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "3",
      title: "Chill Vibes",
      description: "Laid back beats for relaxation",
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "4",
      title: "Workout Mix",
      description: "Energy-boosting tracks for your exercise",
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "5",
      title: "Road Trip",
      description: "Perfect soundtrack for your journey",
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "6",
      title: "Study Focus",
      description: "Concentration-enhancing music",
      cover: "/placeholder.svg?height=200&width=200",
    },
  ];

  const recentlyPlayed = [
    {
      id: "101",
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "102",
      title: "As It Was",
      artist: "Harry Styles",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "103",
      title: "Bad Habits",
      artist: "Ed Sheeran",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "104",
      title: "Stay",
      artist: "The Kid LAROI, Justin Bieber",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "105",
      title: "Heat Waves",
      artist: "Glass Animals",
      cover: "/placeholder.svg?height=120&width=120",
    },
  ];

  const trendingNow = [
    {
      id: "201",
      title: "Flowers",
      artist: "Miley Cyrus",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "202",
      title: "Kill Bill",
      artist: "SZA",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "203",
      title: "Anti-Hero",
      artist: "Taylor Swift",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "204",
      title: "Unholy",
      artist: "Sam Smith, Kim Petras",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "205",
      title: "Creepin'",
      artist: "Metro Boomin, The Weeknd",
      cover: "/placeholder.svg?height=120&width=120",
    },
  ];

  const popularArtists = [
    {
      id: "a1",
      name: "The Weeknd",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "a2",
      name: "Taylor Swift",
      cover: "/placeholder.svg?height=120&width=120",
    },
    { id: "a3", name: "Drake", cover: "/placeholder.svg?height=120&width=120" },
    {
      id: "a4",
      name: "Billie Eilish",
      cover: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "a5",
      name: "Ed Sheeran",
      cover: "/placeholder.svg?height=120&width=120",
    },
  ];

  const handlePlayItem = (type: string, id: string) => {
    const itemKey = `${type}-${id}`;
    setPlayingItem(playingItem === itemKey ? null : itemKey);
  };

  const navigateToArtist = (id: string) => {
    router.push(`/artists/${id}`);
  };

  const navigateToPlaylist = (id: string) => {
    router.push(`/playlists/${id}`);
  };

  return (
    <div className="space-y-8 p-6">
      {/* Popular Artists Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Popular Artists</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5">
          {popularArtists.map((artist) => (
            <div
              key={artist.id}
              className="group cursor-pointer"
              onClick={() => navigateToArtist(artist.id)}
            >
              <div className="overflow-hidden rounded-full">
                <img
                  src={artist.cover || "/placeholder.svg"}
                  alt={artist.name}
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
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
        <h2 className="mb-4 text-2xl font-bold">Featured Playlists</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {featuredPlaylists.map((playlist) => (
            <Card
              key={playlist.id}
              className="group cursor-pointer transition-all hover:bg-accent"
              onClick={() => navigateToPlaylist(playlist.id)}
            >
              <CardContent className="p-3">
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={playlist.cover || "/placeholder.svg"}
                    alt={playlist.title}
                    className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayItem("playlist", playlist.id);
                      }}
                    >
                      {playingItem === `playlist-${playlist.id}` ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="font-semibold line-clamp-1">
                    {playlist.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {playlist.description}
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
              onClick={() => router.push(`/albums/1`)}
            >
              <CardContent className="p-3">
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={track.cover || "/placeholder.svg"}
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

      <section>
        <h2 className="mb-4 text-2xl font-bold">Trending Now</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {trendingNow.map((track) => (
            <Card
              key={track.id}
              className="group cursor-pointer transition-all hover:bg-accent"
              onClick={() => router.push(`/albums/1`)}
            >
              <CardContent className="p-3">
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={track.cover || "/placeholder.svg"}
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
    </div>
  );
}
