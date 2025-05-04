"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  Heart,
  Share2,
  MoreHorizontal,
  Clock,
  Calendar,
  Music,
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
import { useToast } from "@/hooks/use-toast";
import type { ViewType } from "@/components/music-app";

interface AlbumViewProps {
  id: string | null;
  onNavigate?: (view: ViewType, id?: string) => void;
}

export function AlbumView({ id, onNavigate }: AlbumViewProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const { toast } = useToast();

  const album = {
    id: id || "a1",
    title: "After Hours",
    artist: "The Weeknd",
    artistId: "1",
    releaseDate: "March 20, 2020",
    tracks: 14,
    duration: "56 min 16 sec",
    cover: "/placeholder.svg?height=300&width=300",
    label: "XO / Republic Records",
    description:
      "After Hours is the fourth studio album by Canadian singer the Weeknd, released on March 20, 2020, by XO and Republic Records. It was produced primarily by the Weeknd, along with a variety of producers such as DaHeala, Illangelo, Max Martin, Metro Boomin, and OPN.",
    genres: ["R&B", "Pop", "New Wave", "Dream Pop"],

    isNFT: true,
    price: 2.5,
    currency: "SOL",
    totalSupply: 1000,
    minted: 782,
    owned: false,
  };

  const tracks = [
    {
      id: "t1",
      number: 1,
      title: "Alone Again",
      duration: 240,
      isExplicit: false,
      isPlayable: true,
      plays: "124M",
    },
    {
      id: "t2",
      number: 2,
      title: "Too Late",
      duration: 200,
      isExplicit: true,
      isPlayable: true,
      plays: "98M",
    },
    {
      id: "t3",
      number: 3,
      title: "Hardest To Love",
      duration: 211,
      isExplicit: false,
      isPlayable: true,
      plays: "156M",
    },
    {
      id: "t4",
      number: 4,
      title: "Scared To Live",
      duration: 191,
      isExplicit: false,
      isPlayable: true,
      plays: "87M",
    },
    {
      id: "t5",
      number: 5,
      title: "Snowchild",
      duration: 243,
      isExplicit: true,
      isPlayable: true,
      plays: "112M",
    },
    {
      id: "t6",
      number: 6,
      title: "Escape From LA",
      duration: 352,
      isExplicit: true,
      isPlayable: true,
      plays: "103M",
    },
    {
      id: "t7",
      number: 7,
      title: "Heartless",
      duration: 198,
      isExplicit: true,
      isPlayable: true,
      plays: "1.1B",
    },
    {
      id: "t8",
      number: 8,
      title: "Faith",
      duration: 282,
      isExplicit: true,
      isPlayable: true,
      plays: "145M",
    },
    {
      id: "t9",
      number: 9,
      title: "Blinding Lights",
      duration: 201,
      isExplicit: false,
      isPlayable: true,
      plays: "3.2B",
    },
    {
      id: "t10",
      number: 10,
      title: "In Your Eyes",
      duration: 216,
      isExplicit: false,
      isPlayable: true,
      plays: "1.3B",
    },
    {
      id: "t11",
      number: 11,
      title: "Save Your Tears",
      duration: 215,
      isExplicit: false,
      isPlayable: true,
      plays: "2.1B",
    },
    {
      id: "t12",
      number: 12,
      title: "Repeat After Me (Interlude)",
      duration: 183,
      isExplicit: true,
      isPlayable: true,
      plays: "76M",
    },
    {
      id: "t13",
      number: 13,
      title: "After Hours",
      duration: 361,
      isExplicit: false,
      isPlayable: true,
      plays: "890M",
    },
    {
      id: "t14",
      number: 14,
      title: "Until I Bleed Out",
      duration: 196,
      isExplicit: false,
      isPlayable: true,
      plays: "92M",
    },
  ];

  const moreAlbums = [
    {
      id: "a2",
      title: "Starboy",
      year: "2016",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "a3",
      title: "Beauty Behind the Madness",
      year: "2015",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "a4",
      title: "Dawn FM",
      year: "2022",
      cover: "/placeholder.svg?height=150&width=150",
    },
    {
      id: "a5",
      title: "My Dear Melancholy",
      year: "2018",
      cover: "/placeholder.svg?height=150&width=150",
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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

  const handleMintNFT = () => {
    toast({
      title: "Mint Transaction Initiated",
      description: `Starting the process to mint "${album.title}" NFT. Please confirm in your wallet.`,
      duration: 5000,
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/albums/${album.id}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to "${album.title}" has been copied to clipboard.`,
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

  const totalDuration = tracks.reduce(
    (total, track) => total + track.duration,
    0
  );
  const formatTotalDuration = () => {
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    const seconds = totalDuration % 60;

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min ${seconds} sec`;
  };

  return (
    <div className="flex flex-col">
      {/* Album Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
            <img
              src={album.cover || "/placeholder.svg"}
              alt={album.title}
              className="h-full w-full object-cover"
            />
            {album.isNFT && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary text-primary-foreground">
                  NFT
                </Badge>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="text-sm font-medium uppercase">Album</div>
            <h1 className="mt-1 text-3xl font-bold md:text-5xl">
              {album.title}
            </h1>
            <div className="mt-4 flex items-center gap-2">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() =>
                  onNavigate && onNavigate("artist", album.artistId)
                }
              >
                <img
                  src="/placeholder.svg?height=30&width=30"
                  alt={album.artist}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="font-medium hover:underline">
                  {album.artist}
                </span>
              </div>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{album.releaseDate}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {album.tracks} songs,
              </span>
              <span className="text-muted-foreground">
                {formatTotalDuration()}
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
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {album.isNFT && (
              <div className="mt-4 flex flex-col gap-2 bg-card p-3 rounded-md border w-full md:max-w-xs">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">NFT Price</div>
                  <div className="font-bold">
                    {album.price} {album.currency}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Availability</div>
                  <div className="text-sm">
                    {album.minted}/{album.totalSupply} minted
                  </div>
                </div>
                <Button
                  className="w-full mt-2"
                  onClick={handleMintNFT}
                  disabled={album.minted >= album.totalSupply || album.owned}
                >
                  {album.owned
                    ? "Owned"
                    : album.minted >= album.totalSupply
                    ? "Sold Out"
                    : "Mint NFT"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Album Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-10">
          {/* Tracks Section */}
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
                {tracks.map((track) => (
                  <TableRow key={track.id} className="group hover:bg-accent">
                    <TableCell className="text-center font-medium text-muted-foreground">
                      <div className="relative flex items-center justify-center">
                        <span
                          className={`${
                            playingTrackId === track.id
                              ? "opacity-0"
                              : "group-hover:opacity-0"
                          }`}
                        >
                          {track.number}
                        </span>
                        <div
                          className={`absolute inset-0 flex items-center justify-center ${
                            playingTrackId === track.id
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                          onClick={() => handlePlayTrack(track.id)}
                        >
                          {playingTrackId === track.id ? (
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          ) : (
                            <Play className="h-4 w-4 cursor-pointer" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="flex items-center gap-1 font-medium">
                            {track.title}
                            {track.isExplicit && (
                              <span className="ml-1 rounded-sm bg-muted px-1 text-xs">
                                E
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {track.plays}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatTime(track.duration)}
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

          {/* Album Info Section */}
          <section className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">About</h2>
              <p className="text-muted-foreground">{album.description}</p>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Release Date</div>
                    <div className="text-sm text-muted-foreground">
                      {album.releaseDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Music className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Genres</div>
                    <div className="text-sm text-muted-foreground">
                      {album.genres.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold">More by {album.artist}</h2>
              <div className="grid grid-cols-2 gap-4">
                {moreAlbums.map((album) => (
                  <div
                    key={album.id}
                    className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent"
                    onClick={() => onNavigate && onNavigate("album", album.id)}
                  >
                    <img
                      src={album.cover || "/placeholder.svg"}
                      alt={album.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div>
                      <div className="font-medium line-clamp-1">
                        {album.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {album.year}
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
