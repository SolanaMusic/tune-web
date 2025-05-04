"use client";

import { useState } from "react";
import {
  Clock,
  MoreHorizontal,
  Play,
  Pause,
  Heart,
  Share2,
  Music,
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
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PlaylistViewProps {
  id: string | null;
}

export function PlaylistView({ id }: PlaylistViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [isLiked, setIsLiked] = useState(id === "liked");
  const { toast } = useToast();

  const playlist = {
    id: id || "1",
    title: id === "liked" ? "Liked Songs" : "Discover Weekly",
    description:
      id === "liked"
        ? "Your favorite tracks"
        : "Your weekly mixtape of fresh music",
    cover: "/placeholder.svg?height=300&width=300",
    owner: "MusicFusion",
    followers: id === "liked" ? "Only you" : "2.3M",
    totalTracks: 30,
    duration: "2h 15m",
  };

  const tracks = Array.from({ length: 20 }, (_, i) => ({
    id: `t${i + 1}`,
    title: `Track ${i + 1}`,
    artist: `Artist ${Math.floor(i / 3) + 1}`,
    album: "Album Title",
    duration: "3:45",
    isLiked: id === "liked" || Math.random() > 0.5,
  }));

  const handlePlayPause = (trackId: string | null) => {
    if (isPlaying && playingTrackId === trackId) {
      setIsPlaying(false);
      setPlayingTrackId(null);
    } else {
      setIsPlaying(true);
      setPlayingTrackId(trackId);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Liked Songs." : "Added to Liked Songs.",
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/playlists/${playlist.id}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to "${playlist.title}" has been copied to clipboard.`,
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

  const handleToggleLikeTrack = (
    trackId: string,
    isCurrentlyLiked: boolean
  ) => {
    toast({
      title: isCurrentlyLiked
        ? "Removed from Liked Songs"
        : "Added to Liked Songs",
      description: `Track has been ${
        isCurrentlyLiked ? "removed from" : "added to"
      } your Liked Songs.`,
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Playlist Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background p-6 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-md shadow-lg">
            {id === "liked" ? (
              <div className="flex h-full w-full items-center justify-center bg-primary/20">
                <Heart className="h-32 w-32 text-primary" fill="currentColor" />
              </div>
            ) : (
              <img
                src={playlist.cover || "/placeholder.svg"}
                alt="Playlist Cover"
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <div className="text-sm font-medium uppercase">Playlist</div>
            <h1 className="mt-1 text-3xl font-bold md:text-5xl">
              {playlist.title}
            </h1>
            <p className="mt-2 text-muted-foreground">{playlist.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="font-medium">Created by {playlist.owner}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {playlist.followers} followers
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {playlist.totalTracks} songs,
              </span>
              <span className="text-muted-foreground">{playlist.duration}</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                className="rounded-full"
                onClick={() => handlePlayPause(tracks[0].id)}
              >
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
              {id !== "liked" && (
                <Button
                  variant={isLiked ? "default" : "outline"}
                  size="icon"
                  className="rounded-full"
                  onClick={toggleLike}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isLiked ? "fill-primary-foreground" : ""
                    }`}
                  />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleShare}
              >
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

      {/* Tracklist */}
      <ScrollArea className="flex-1 p-6">
        {tracks.length > 0 ? (
          <>
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
                {tracks
                  .slice(0, showAllTracks ? tracks.length : 5)
                  .map((track, index) => (
                    <TableRow key={track.id} className="group hover:bg-accent">
                      <TableCell className="font-medium">
                        <div className="relative flex items-center justify-center">
                          <span
                            className={`${
                              playingTrackId === track.id
                                ? "opacity-0"
                                : "group-hover:opacity-0"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div
                            className={`absolute inset-0 flex items-center justify-center ${
                              playingTrackId === track.id
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                            onClick={() => handlePlayPause(track.id)}
                          >
                            {playingTrackId === track.id ? (
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            ) : (
                              <Play className="h-4 w-4 cursor-pointer" />
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{track.title}</TableCell>
                      <TableCell>{track.artist}</TableCell>
                      <TableCell>{track.album}</TableCell>
                      <TableCell className="text-right">
                        {track.duration}
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
                            onClick={() =>
                              handleToggleLikeTrack(track.id, track.isLiked)
                            }
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
                              <DropdownMenuItem>
                                Add to playlist
                              </DropdownMenuItem>
                              <DropdownMenuItem>Go to artist</DropdownMenuItem>
                              <DropdownMenuItem>Go to album</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {tracks.length > 5 && (
              <Button
                variant="link"
                className="mt-4"
                onClick={() => setShowAllTracks(!showAllTracks)}
              >
                Show {showAllTracks ? "Less" : "All"}
              </Button>
            )}
          </>
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
            <Button>Browse Music</Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
