"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Play,
  Pause,
  MoreHorizontal,
  Heart,
  Share2,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ArtistViewProps {
  id: string | null;
}

export function ArtistView({ id }: ArtistViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [showMoreTracks, setShowMoreTracks] = useState(false);

  const artist = {
    id: id || "1",
    name: "The Weeknd",
    verified: true,
    subscribers: "38.5M",
    monthlyListeners: "84.2M",
    coverImage: "/placeholder.svg?height=400&width=1200",
    profileImage: "/placeholder.svg?height=200&width=200",
    bio: "Abel Makkonen Tesfaye, known professionally as the Weeknd, is a Canadian singer, songwriter, and record producer. He is known for his sonic versatility and dark lyricism, with his music exploring escapism, romance, and melancholia, and often inspired by personal experiences.",
  };

  const topSongs = [
    {
      id: "s1",
      title: "Blinding Lights",
      album: "After Hours",
      albumId: "a1",
      plays: "3.2B",
      duration: 201,
      listenings: "2.4M",
      isExplicit: false,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s2",
      title: "Starboy",
      album: "Starboy",
      albumId: "a2",
      plays: "2.8B",
      duration: 230,
      listenings: "1.8M",
      isExplicit: true,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s3",
      title: "Save Your Tears",
      album: "After Hours",
      albumId: "a1",
      plays: "2.1B",
      duration: 215,
      listenings: "1.5M",
      isExplicit: false,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s4",
      title: "The Hills",
      album: "Beauty Behind the Madness",
      albumId: "a3",
      plays: "1.9B",
      duration: 242,
      listenings: "1.3M",
      isExplicit: true,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s5",
      title: "Die For You",
      album: "Starboy",
      albumId: "a2",
      plays: "1.7B",
      duration: 260,
      listenings: "956K",
      isExplicit: false,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s6",
      title: "Call Out My Name",
      album: "My Dear Melancholy",
      albumId: "a5",
      plays: "1.5B",
      duration: 228,
      listenings: "874K",
      isExplicit: true,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s7",
      title: "I Feel It Coming",
      album: "Starboy",
      albumId: "a2",
      plays: "1.4B",
      duration: 269,
      listenings: "782K",
      isExplicit: false,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s8",
      title: "Often",
      album: "Beauty Behind the Madness",
      albumId: "a3",
      plays: "1.3B",
      duration: 250,
      listenings: "645K",
      isExplicit: true,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s9",
      title: "Earned It",
      album: "Beauty Behind the Madness",
      albumId: "a3",
      plays: "1.2B",
      duration: 277,
      listenings: "598K",
      isExplicit: false,
      cover: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "s10",
      title: "Heartless",
      album: "After Hours",
      albumId: "a1",
      plays: "1.1B",
      duration: 198,
      listenings: "542K",
      isExplicit: true,
      cover: "/placeholder.svg?height=60&width=60",
    },
  ];

  const albums = [
    {
      id: "a1",
      title: "After Hours",
      year: "2020",
      tracks: 14,
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "a2",
      title: "Starboy",
      year: "2016",
      tracks: 18,
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "a3",
      title: "Beauty Behind the Madness",
      year: "2015",
      tracks: 14,
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "a4",
      title: "Dawn FM",
      year: "2022",
      tracks: 16,
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "a5",
      title: "My Dear Melancholy",
      year: "2018",
      tracks: 6,
      cover: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "a6",
      title: "House of Balloons",
      year: "2011",
      tracks: 9,
      cover: "/placeholder.svg?height=200&width=200",
    },
  ];

  const similarArtists = [
    {
      id: "sa1",
      name: "Drake",
      followers: "65.3M",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "sa2",
      name: "Post Malone",
      followers: "42.1M",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "sa3",
      name: "Bruno Mars",
      followers: "39.8M",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "sa4",
      name: "Kendrick Lamar",
      followers: "37.5M",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      id: "sa5",
      name: "Dua Lipa",
      followers: "35.2M",
      image: "/placeholder.svg?height=120&width=120",
    },
  ];

  const artistNFTs = [
    {
      id: "nft1",
      title: "The Weeknd VIP Experience",
      description: "Exclusive VIP access to The Weeknd's next tour",
      price: 5.0,
      currency: "SOL",
      totalSupply: 100,
      minted: 78,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "nft2",
      title: "After Hours Digital Collectible",
      description: "Limited edition digital artwork from After Hours",
      price: 2.5,
      currency: "SOL",
      totalSupply: 500,
      minted: 342,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "nft3",
      title: "Starboy Exclusive Track",
      description: "Unreleased track from Starboy sessions",
      price: 1.8,
      currency: "SOL",
      totalSupply: 1000,
      minted: 876,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "nft4",
      title: "Dawn FM Early Access",
      description: "Early access to upcoming Dawn FM content",
      price: 3.2,
      currency: "SOL",
      totalSupply: 250,
      minted: 187,
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  const userPlaylists = [
    { id: "p1", name: "My Summer Mix", tracks: 24 },
    { id: "p2", name: "Indie Discoveries", tracks: 42 },
    { id: "p3", name: "Coding Focus", tracks: 18 },
    { id: "p4", name: "Throwback Jams", tracks: 36 },
    { id: "p5", name: "Chill Evening", tracks: 15 },
    { id: "p6", name: "Workout Motivation", tracks: 28 },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    toast({
      title: isSubscribed ? "Unsubscribed" : "Subscribed",
      description: `You have ${
        isSubscribed ? "unsubscribed from" : "subscribed to"
      } ${artist.name}.`,
      duration: 3000,
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: `${artist.name} has been ${
        isLiked ? "removed from" : "added to"
      } your favorites.`,
      duration: 3000,
    });
  };

  const handlePlaySong = (songId: string) => {
    setPlayingSongId(songId === playingSongId ? null : songId);
    console.log(`Playing song: ${songId}`);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/artists/${artist.id}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to ${artist.name}'s profile has been copied to clipboard.`,
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

  const handleLikeSong = (songId: string, songTitle: string) => {
    toast({
      title: "Added to Liked Songs",
      description: `"${songTitle}" has been added to your Liked Songs.`,
      duration: 3000,
    });
  };

  const handleAddToPlaylist = (
    songId: string,
    songTitle: string,
    playlistId: string,
    playlistName: string
  ) => {
    toast({
      title: "Added to Playlist",
      description: `"${songTitle}" has been added to ${playlistName}.`,
      duration: 3000,
    });
  };

  const handleMintNFT = (nftId: string, nftTitle: string) => {
    toast({
      title: "Mint Transaction Initiated",
      description: `Starting the process to mint "${nftTitle}" NFT. Please confirm in your wallet.`,
      duration: 5000,
    });
  };

  return (
    <div className="flex flex-col">
      <div
        className="relative flex flex-col bg-gradient-to-b from-primary/30 to-background pb-6"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), var(--background)), url(${artist.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-6 pt-8 md:pt-16">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
            <div className="h-40 w-40 flex-shrink-0 overflow-hidden rounded-full border-4 border-background shadow-lg md:h-48 md:w-48">
              <img
                src={artist.profileImage || "/placeholder.svg"}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold md:text-5xl">
                  {artist.name}
                </h1>
                {artist.verified && (
                  <CheckCircle className="h-5 w-5 text-primary md:h-6 md:w-6" />
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{artist.subscribers} subscribers</span>
                <span>•</span>
                <span>{artist.monthlyListeners} monthly listeners</span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-full"
                  onClick={() => handlePlaySong("s1")}
                >
                  {playingSongId === "s1" ? (
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
                  onClick={handleSubscribe}
                >
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-primary text-primary" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={handleShare}
                >
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
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-12">
            <section>
              <h2 className="mb-6 text-2xl font-bold">Popular</h2>
              <div className="grid gap-3">
                {topSongs.slice(0, showMoreTracks ? 10 : 5).map((song) => (
                  <div
                    key={song.id}
                    className={`group flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-accent ${
                      playingSongId === song.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={song.cover || "/placeholder.svg"}
                        alt={song.title}
                        className="h-full w-full object-cover"
                      />
                      <div
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                          playingSongId === song.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                        onClick={() => handlePlaySong(song.id)}
                      >
                        {playingSongId === song.id ? (
                          <div className="h-3 w-3 animate-pulse rounded-full bg-white"></div>
                        ) : (
                          <Play className="h-6 w-6 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 font-medium truncate">
                        {song.title}
                        {song.isExplicit && (
                          <span className="ml-1 rounded-sm bg-muted px-1 text-xs">
                            E
                          </span>
                        )}
                      </div>
                      <div
                        className="text-sm text-muted-foreground truncate cursor-pointer hover:underline"
                        onClick={() => router.push(`/albums/${song.albumId}`)}
                      >
                        {song.album}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground hidden md:block">
                      {song.listenings}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(song.duration)}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-56 p-0">
                        <div className="p-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleLikeSong(song.id, song.title)}
                          >
                            Add to Liked Songs
                          </Button>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                className="w-full justify-between"
                              >
                                Add to Playlist
                                <span>▶</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              align="end"
                              side="right"
                              className="w-56 p-0"
                            >
                              <div className="p-1 max-h-60 overflow-auto">
                                {userPlaylists.map((playlist) => (
                                  <Button
                                    key={playlist.id}
                                    variant="ghost"
                                    className="w-full justify-start text-sm"
                                    onClick={() =>
                                      handleAddToPlaylist(
                                        song.id,
                                        song.title,
                                        playlist.id,
                                        playlist.name
                                      )
                                    }
                                  >
                                    {playlist.name}
                                  </Button>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={handleShare}
                          >
                            Share
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() =>
                              router.push(`/albums/${song.albumId}`)
                            }
                          >
                            Go to Album
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
              <Button
                variant="link"
                className="mt-2 px-2"
                onClick={() => setShowMoreTracks(!showMoreTracks)}
              >
                {showMoreTracks ? "Show less" : "See more"}
              </Button>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold">Albums</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {albums.map((album) => (
                  <Card
                    key={album.id}
                    className="group cursor-pointer transition-all hover:bg-accent"
                    onClick={() => router.push(`/albums/${album.id}`)}
                  >
                    <CardContent className="p-3">
                      <div className="relative overflow-hidden rounded-md">
                        <img
                          src={album.cover || "/placeholder.svg"}
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
                          {album.year} • {album.tracks} tracks
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-2xl font-bold">Fans might also like</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {similarArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/artists/${artist.id}`)}
                  >
                    <div className="overflow-hidden rounded-full">
                      <img
                        src={artist.image || "/placeholder.svg"}
                        alt={artist.name}
                        className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <h3 className="font-semibold line-clamp-1">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {artist.followers} followers
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="discography">
            <div className="space-y-8">
              <section>
                <h2 className="mb-6 text-2xl font-bold">All Albums</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {albums.map((album) => (
                    <Card
                      key={album.id}
                      className="group cursor-pointer transition-all hover:bg-accent"
                      onClick={() => router.push(`/albums/${album.id}`)}
                    >
                      <CardContent className="p-3">
                        <div className="relative overflow-hidden rounded-md">
                          <img
                            src={album.cover || "/placeholder.svg"}
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
                            {album.year} • {album.tracks} tracks
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="mb-6 text-2xl font-bold">All Songs</h2>
                <div className="grid gap-3">
                  {topSongs.map((song) => (
                    <div
                      key={song.id}
                      className={`group flex items-center gap-4 rounded-md p-2 transition-colors hover:bg-accent ${
                        playingSongId === song.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={song.cover || "/placeholder.svg"}
                          alt={song.title}
                          className="h-full w-full object-cover"
                        />
                        <div
                          className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${
                            playingSongId === song.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                          onClick={() => handlePlaySong(song.id)}
                        >
                          {playingSongId === song.id ? (
                            <div className="h-3 w-3 animate-pulse rounded-full bg-white"></div>
                          ) : (
                            <Play className="h-6 w-6 text-white" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 font-medium truncate">
                          {song.title}
                          {song.isExplicit && (
                            <span className="ml-1 rounded-sm bg-muted px-1 text-xs">
                              E
                            </span>
                          )}
                        </div>
                        <div
                          className="text-sm text-muted-foreground truncate cursor-pointer hover:underline"
                          onClick={() => router.push(`/albums/${song.albumId}`)}
                        >
                          {song.album}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground hidden md:block">
                        {song.plays}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(song.duration)}
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-56 p-0">
                          <div className="p-1">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() =>
                                handleLikeSong(song.id, song.title)
                              }
                            >
                              Add to Liked Songs
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-between"
                                >
                                  Add to Playlist
                                  <span>▶</span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                align="end"
                                side="right"
                                className="w-56 p-0"
                              >
                                <div className="p-1 max-h-60 overflow-auto">
                                  {userPlaylists.map((playlist) => (
                                    <Button
                                      key={playlist.id}
                                      variant="ghost"
                                      className="w-full justify-start text-sm"
                                      onClick={() =>
                                        handleAddToPlaylist(
                                          song.id,
                                          song.title,
                                          playlist.id,
                                          playlist.name
                                        )
                                      }
                                    >
                                      {playlist.name}
                                    </Button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={handleShare}
                            >
                              Share
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() =>
                                router.push(`/albums/${song.albumId}`)
                              }
                            >
                              Go to Album
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="nfts">
            <div className="space-y-8">
              <section>
                <h2 className="mb-6 text-2xl font-bold">Artist NFTs</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-5">
                  {artistNFTs.map((nft) => (
                    <Card
                      key={nft.id}
                      className="overflow-hidden transition-all hover:shadow-md"
                    >
                      <div className="relative">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.title}
                          className="aspect-square w-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary/80 text-primary-foreground">
                            NFT
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold line-clamp-1 text-sm">
                          {nft.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {nft.description}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium">
                              {nft.price} {nft.currency}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {nft.minted}/{nft.totalSupply}
                          </div>
                        </div>

                        <div className="mt-3 w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${(nft.minted / nft.totalSupply) * 100}%`,
                            }}
                          ></div>
                        </div>

                        <Button
                          className="w-full mt-4"
                          onClick={() => handleMintNFT(nft.id, nft.title)}
                          disabled={nft.minted >= nft.totalSupply}
                        >
                          {nft.minted >= nft.totalSupply
                            ? "Sold Out"
                            : "Mint NFT"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="max-w-3xl space-y-6">
              <h2 className="text-2xl font-bold">About</h2>
              <p className="text-muted-foreground">{artist.bio}</p>
              <p className="text-muted-foreground">
                The Weeknd has won numerous accolades, including four Grammy
                Awards, 20 Billboard Music Awards, 17 Juno Awards, six American
                Music Awards, two MTV Video Music Awards, and nominations for an
                Academy Award, a Latin Grammy Award, and a Primetime Emmy Award.
              </p>

              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-4">
                  Career Highlights
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Released debut mixtape "House of Balloons" in 2011</li>
                  <li>• Signed with Republic Records in 2012</li>
                  <li>• Released debut studio album "Kiss Land" in 2013</li>
                  <li>
                    • "Beauty Behind the Madness" (2015) topped the Billboard
                    200
                  </li>
                  <li>
                    • "Starboy" (2016) debuted at number one on the Billboard
                    200
                  </li>
                  <li>
                    • "After Hours" (2020) spawned the global hit "Blinding
                    Lights"
                  </li>
                  <li>• Headlined the Super Bowl LV halftime show in 2021</li>
                  <li>• Released "Dawn FM" in 2022</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
