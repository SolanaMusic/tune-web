"use client";

import type React from "react";
import { useState, useRef, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  X,
  CalendarIcon,
  ImageIcon,
  Play,
  Pause,
  Upload,
  Music,
  Disc,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CreateContentModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for artists
const artists = [
  { id: "1", name: "Drake" },
  { id: "2", name: "Taylor Swift" },
  { id: "3", name: "The Weeknd" },
  { id: "4", name: "Billie Eilish" },
  { id: "5", name: "Post Malone" },
  { id: "6", name: "Ariana Grande" },
  { id: "7", name: "Ed Sheeran" },
  { id: "8", name: "Dua Lipa" },
  { id: "9", name: "Justin Bieber" },
  { id: "10", name: "Bad Bunny" },
];

// Mock data for genres
const genres = [
  { id: "1", name: "Pop" },
  { id: "2", name: "Hip-Hop" },
  { id: "3", name: "R&B" },
  { id: "4", name: "Rock" },
  { id: "5", name: "Electronic" },
  { id: "6", name: "Country" },
  { id: "7", name: "Jazz" },
  { id: "8", name: "Classical" },
  { id: "9", name: "Reggae" },
  { id: "10", name: "Folk" },
  { id: "11", name: "Metal" },
  { id: "12", name: "Blues" },
  { id: "13", name: "Latin" },
  { id: "14", name: "Indie" },
];

// Mock data for tracks
const tracks = [
  { id: "1", title: "Hotline Bling", artistId: "1" },
  { id: "2", title: "God's Plan", artistId: "1" },
  { id: "3", title: "One Dance", artistId: "1" },
  { id: "4", title: "Blank Space", artistId: "2" },
  { id: "5", title: "Anti-Hero", artistId: "2" },
  { id: "6", title: "Shake It Off", artistId: "2" },
  { id: "7", title: "Blinding Lights", artistId: "3" },
  { id: "8", title: "Starboy", artistId: "3" },
  { id: "9", title: "Save Your Tears", artistId: "3" },
  { id: "10", title: "Bad Guy", artistId: "4" },
  { id: "11", title: "Happier Than Ever", artistId: "4" },
  { id: "12", title: "Ocean Eyes", artistId: "4" },
  { id: "13", title: "Circles", artistId: "5" },
  { id: "14", title: "Rockstar", artistId: "5" },
  { id: "15", title: "Sunflower", artistId: "5" },
];

// Mock data for albums
const albums = [
  { id: "1", title: "Certified Lover Boy", artistId: "1" },
  { id: "2", title: "Scorpion", artistId: "1" },
  { id: "3", title: "Views", artistId: "1" },
  { id: "4", title: "Midnights", artistId: "2" },
  { id: "5", title: "Folklore", artistId: "2" },
  { id: "6", title: "1989", artistId: "2" },
  { id: "7", title: "After Hours", artistId: "3" },
  { id: "8", title: "Dawn FM", artistId: "3" },
  { id: "9", title: "Starboy", artistId: "3" },
  { id: "10", title: "Happier Than Ever", artistId: "4" },
  {
    id: "11",
    title: "When We All Fall Asleep, Where Do We Go?",
    artistId: "4",
  },
  { id: "12", title: "Hollywood's Bleeding", artistId: "5" },
  { id: "13", title: "Beerbongs & Bentleys", artistId: "5" },
];

export function CreateContentModal({
  children,
  open,
  onOpenChange,
}: CreateContentModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("album");

  // Album state
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumReleaseDate, setAlbumReleaseDate] = useState<Date | undefined>(
    new Date()
  );
  const [albumSelectedArtists, setAlbumSelectedArtists] = useState<string[]>(
    []
  );
  const [albumSelectedTracks, setAlbumSelectedTracks] = useState<string[]>([]);
  const [albumCoverImage, setAlbumCoverImage] = useState<string | null>(null);
  const [albumArtistsOpen, setAlbumArtistsOpen] = useState(false);
  const [albumTracksOpen, setAlbumTracksOpen] = useState(false);
  const albumFileInputRef = useRef<HTMLInputElement>(null);

  // Track state
  const [trackTitle, setTrackTitle] = useState("");
  const [trackReleaseDate, setTrackReleaseDate] = useState<Date | undefined>(
    new Date()
  );
  const [trackSelectedArtists, setTrackSelectedArtists] = useState<string[]>(
    []
  );
  const [trackSelectedGenres, setTrackSelectedGenres] = useState<string[]>([]);
  const [trackSelectedAlbum, setTrackSelectedAlbum] = useState<string | null>(
    null
  );
  const [trackCoverImage, setTrackCoverImage] = useState<string | null>(null);
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [trackUrl, setTrackUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackArtistsOpen, setTrackArtistsOpen] = useState(false);
  const [trackGenresOpen, setTrackGenresOpen] = useState(false);
  const [trackAlbumsOpen, setTrackAlbumsOpen] = useState(false);
  const trackImageInputRef = useRef<HTMLInputElement>(null);
  const trackFileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check if track cover image is required
  const isTrackCoverImageRequired = !trackSelectedAlbum;

  // Filter albums based on selected artists for track
  const filteredAlbums = albums.filter((album) =>
    trackSelectedArtists.includes(album.artistId)
  );

  // Filter tracks based on selected artists for album
  const filteredTracks = tracks.filter((track) =>
    albumSelectedArtists.includes(track.artistId)
  );

  // Handle album image upload
  const handleAlbumImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAlbumCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle track image upload
  const handleTrackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTrackCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle track file upload
  const handleTrackFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTrackFile(file);
      const url = URL.createObjectURL(file);
      setTrackUrl(url);
    }
  };

  // Remove album image
  const removeAlbumImage = () => {
    setAlbumCoverImage(null);
    if (albumFileInputRef.current) {
      albumFileInputRef.current.value = "";
    }
  };

  // Remove track image
  const removeTrackImage = () => {
    setTrackCoverImage(null);
    if (trackImageInputRef.current) {
      trackImageInputRef.current.value = "";
    }
  };

  // Remove track file
  const removeTrackFile = () => {
    if (trackUrl) {
      URL.revokeObjectURL(trackUrl);
    }
    setTrackFile(null);
    setTrackUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (trackFileInputRef.current) {
      trackFileInputRef.current.value = "";
    }
  };

  // Trigger file input click
  const triggerAlbumFileInput = () => {
    if (albumFileInputRef.current) {
      albumFileInputRef.current.click();
    }
  };

  const triggerTrackImageInput = () => {
    if (trackImageInputRef.current) {
      trackImageInputRef.current.click();
    }
  };

  const triggerTrackFileInput = () => {
    if (trackFileInputRef.current) {
      trackFileInputRef.current.click();
    }
  };

  // Toggle audio playback
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update audio time
  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Set audio duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle album form submission
  const handleAlbumSubmit = () => {
    if (!albumTitle) {
      toast({
        title: "Missing Information",
        description: "Please enter an album title",
        variant: "destructive",
      });
      return;
    }

    if (albumSelectedArtists.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one artist",
        variant: "destructive",
      });
      return;
    }

    if (!albumReleaseDate) {
      toast({
        title: "Missing Information",
        description: "Please select a release date",
        variant: "destructive",
      });
      return;
    }

    if (!albumCoverImage) {
      toast({
        title: "Missing Information",
        description: "Please upload a cover image",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Album Created",
      description: `"${albumTitle}" has been created successfully`,
    });

    resetAlbumForm();
    onOpenChange(false);
  };

  // Handle track form submission
  const handleTrackSubmit = () => {
    if (!trackTitle) {
      toast({
        title: "Missing Information",
        description: "Please enter a track title",
        variant: "destructive",
      });
      return;
    }

    if (trackSelectedArtists.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one artist",
        variant: "destructive",
      });
      return;
    }

    if (trackSelectedGenres.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one genre",
        variant: "destructive",
      });
      return;
    }

    if (!trackReleaseDate) {
      toast({
        title: "Missing Information",
        description: "Please select a release date",
        variant: "destructive",
      });
      return;
    }

    if (!trackFile) {
      toast({
        title: "Missing Information",
        description: "Please upload a track file",
        variant: "destructive",
      });
      return;
    }

    if (isTrackCoverImageRequired && !trackCoverImage) {
      toast({
        title: "Missing Information",
        description: "Please upload a cover image or select an album",
        variant: "destructive",
      });
      return;
    }

    // Create track object
    const track = {
      title: trackTitle,
      releaseDate: trackReleaseDate,
      artists: trackSelectedArtists.map((id) =>
        artists.find((artist) => artist.id === id)
      ),
      genres: trackSelectedGenres.map((id) =>
        genres.find((genre) => genre.id === id)
      ),
      album: trackSelectedAlbum
        ? albums.find((album) => album.id === trackSelectedAlbum)
        : null,
      coverImage: trackCoverImage,
      trackFile: trackFile?.name,
    };

    toast({
      title: "Track Created",
      description: `"${trackTitle}" has been created successfully`,
    });

    resetTrackForm();
    onOpenChange(false);
  };

  // Reset album form
  const resetAlbumForm = () => {
    setAlbumTitle("");
    setAlbumDescription("");
    setAlbumReleaseDate(new Date());
    setAlbumSelectedArtists([]);
    setAlbumSelectedTracks([]);
    setAlbumCoverImage(null);
    if (albumFileInputRef.current) {
      albumFileInputRef.current.value = "";
    }
  };

  // Reset track form
  const resetTrackForm = () => {
    setTrackTitle("");
    setTrackReleaseDate(new Date());
    setTrackSelectedArtists([]);
    setTrackSelectedGenres([]);
    setTrackSelectedAlbum(null);
    setTrackCoverImage(null);
    setTrackFile(null);
    setTrackUrl(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (trackImageInputRef.current) {
      trackImageInputRef.current.value = "";
    }
    if (trackFileInputRef.current) {
      trackFileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="album"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="album" className="flex items-center gap-2">
              <Disc className="h-4 w-4" />
              Album
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Track
            </TabsTrigger>
          </TabsList>

          <TabsContent value="album" className="mt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="album-title" className="font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="album-title"
                placeholder="Enter album title"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Artists <span className="text-destructive">*</span>
              </Label>
              <Popover
                open={albumArtistsOpen}
                onOpenChange={setAlbumArtistsOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={albumArtistsOpen}
                    className="justify-between"
                  >
                    {albumSelectedArtists.length > 0
                      ? `${albumSelectedArtists.length} artist${
                          albumSelectedArtists.length > 1 ? "s" : ""
                        } selected`
                      : "Select artists..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search artists..." />
                    <CommandList
                      className="max-h-[200px] overflow-y-auto"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>No artists found.</CommandEmpty>
                      <CommandGroup>
                        {artists.map((artist) => (
                          <CommandItem
                            key={artist.id}
                            value={artist.name}
                            onSelect={() => {
                              setAlbumSelectedArtists((prev) =>
                                prev.includes(artist.id)
                                  ? prev.filter((id) => id !== artist.id)
                                  : [...prev, artist.id]
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                albumSelectedArtists.includes(artist.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {artist.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {albumSelectedArtists.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {albumSelectedArtists.map((artistId) => {
                    const artist = artists.find((a) => a.id === artistId);
                    return (
                      <Badge
                        key={artistId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {artist?.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            setAlbumSelectedArtists((prev) =>
                              prev.filter((id) => id !== artistId)
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Release Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !albumReleaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {albumReleaseDate
                      ? format(albumReleaseDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={albumReleaseDate}
                    onSelect={setAlbumReleaseDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Cover Image <span className="text-destructive">*</span>
              </Label>
              <div>
                <input
                  ref={albumFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAlbumImageUpload}
                  className="hidden"
                />

                {!albumCoverImage && (
                  <div
                    onClick={triggerAlbumFileInput}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-primary/50 hover:bg-muted"
                  >
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Click to upload album cover
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP (Max 5MB)
                    </p>
                  </div>
                )}

                {albumCoverImage && (
                  <div className="relative mt-2 inline-block">
                    <img
                      src={albumCoverImage || "/placeholder.svg"}
                      alt="Album cover preview"
                      className="h-48 w-48 rounded-md object-cover shadow-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={removeAlbumImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="album-description" className="font-medium">
                Description (Optional)
              </Label>
              <Textarea
                id="album-description"
                placeholder="Enter album description"
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">Tracks (Optional)</Label>
              <Popover open={albumTracksOpen} onOpenChange={setAlbumTracksOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={albumTracksOpen}
                    className="justify-between"
                    disabled={albumSelectedArtists.length === 0}
                  >
                    {albumSelectedTracks.length > 0
                      ? `${albumSelectedTracks.length} track${
                          albumSelectedTracks.length > 1 ? "s" : ""
                        } selected`
                      : albumSelectedArtists.length === 0
                      ? "Select artists first"
                      : "Select tracks..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search tracks..." />
                    <CommandList
                      className="max-h-[200px]"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>
                        {albumSelectedArtists.length === 0
                          ? "Select artists first"
                          : filteredTracks.length === 0
                          ? "No tracks found for selected artists"
                          : "No tracks found"}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredTracks.map((track) => {
                          const artist = artists.find(
                            (a) => a.id === track.artistId
                          );
                          return (
                            <CommandItem
                              key={track.id}
                              value={track.title}
                              onSelect={() => {
                                setAlbumSelectedTracks((prev) =>
                                  prev.includes(track.id)
                                    ? prev.filter((id) => id !== track.id)
                                    : [...prev, track.id]
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  albumSelectedTracks.includes(track.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span>
                                {track.title}{" "}
                                <span className="text-muted-foreground">
                                  by {artist?.name}
                                </span>
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {albumSelectedTracks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {albumSelectedTracks.map((trackId) => {
                    const track = tracks.find((t) => t.id === trackId);
                    return (
                      <Badge
                        key={trackId}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {track?.title}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            setAlbumSelectedTracks((prev) =>
                              prev.filter((id) => id !== trackId)
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleAlbumSubmit}>Create Album</Button>
            </div>
          </TabsContent>

          <TabsContent value="track" className="mt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="track-title" className="font-medium">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="track-title"
                placeholder="Enter track title"
                value={trackTitle}
                onChange={(e) => setTrackTitle(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Artists <span className="text-destructive">*</span>
              </Label>
              <Popover
                open={trackArtistsOpen}
                onOpenChange={setTrackArtistsOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={trackArtistsOpen}
                    className="justify-between"
                  >
                    {trackSelectedArtists.length > 0
                      ? `${trackSelectedArtists.length} artist${
                          trackSelectedArtists.length > 1 ? "s" : ""
                        } selected`
                      : "Select artists..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search artists..." />
                    <CommandList
                      className="max-h-[200px]"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>No artists found.</CommandEmpty>
                      <CommandGroup>
                        {artists.map((artist) => (
                          <CommandItem
                            key={artist.id}
                            value={artist.name}
                            onSelect={() => {
                              setTrackSelectedArtists((prev) =>
                                prev.includes(artist.id)
                                  ? prev.filter((id) => id !== artist.id)
                                  : [...prev, artist.id]
                              );

                              if (
                                trackSelectedAlbum &&
                                albums.find(
                                  (album) => album.id === trackSelectedAlbum
                                )?.artistId !== artist.id
                              ) {
                                setTrackSelectedAlbum(null);
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                trackSelectedArtists.includes(artist.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {artist.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {trackSelectedArtists.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {trackSelectedArtists.map((artistId) => {
                    const artist = artists.find((a) => a.id === artistId);
                    return (
                      <Badge
                        key={artistId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {artist?.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() => {
                            setTrackSelectedArtists((prev) =>
                              prev.filter((id) => id !== artistId)
                            );
                            if (
                              trackSelectedAlbum &&
                              albums.find(
                                (album) => album.id === trackSelectedAlbum
                              )?.artistId === artistId
                            ) {
                              setTrackSelectedAlbum(null);
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Genres <span className="text-destructive">*</span>
              </Label>
              <Popover open={trackGenresOpen} onOpenChange={setTrackGenresOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={trackGenresOpen}
                    className="justify-between"
                  >
                    {trackSelectedGenres.length > 0
                      ? `${trackSelectedGenres.length} genre${
                          trackSelectedGenres.length > 1 ? "s" : ""
                        } selected`
                      : "Select genres..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search genres..." />
                    <CommandList
                      className="max-h-[200px]"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>No genres found.</CommandEmpty>
                      <CommandGroup>
                        {genres.map((genre) => (
                          <CommandItem
                            key={genre.id}
                            value={genre.name}
                            onSelect={() => {
                              setTrackSelectedGenres((prev) =>
                                prev.includes(genre.id)
                                  ? prev.filter((id) => id !== genre.id)
                                  : [...prev, genre.id]
                              );
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                trackSelectedGenres.includes(genre.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {genre.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {trackSelectedGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {trackSelectedGenres.map((genreId) => {
                    const genre = genres.find((g) => g.id === genreId);
                    return (
                      <Badge
                        key={genreId}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {genre?.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            setTrackSelectedGenres((prev) =>
                              prev.filter((id) => id !== genreId)
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Release Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !trackReleaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {trackReleaseDate
                      ? format(trackReleaseDate, "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={trackReleaseDate}
                    onSelect={setTrackReleaseDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Track File <span className="text-destructive">*</span>
              </Label>
              <div className="flex flex-col gap-4">
                <input
                  ref={trackFileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleTrackFileUpload}
                  className="hidden"
                />

                {!trackFile && (
                  <div
                    onClick={triggerTrackFileInput}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-primary/50 hover:bg-muted"
                  >
                    <Music className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Click to upload track file
                    </p>
                    <p className="text-xs text-muted-foreground">
                      MP3, WAV or FLAC (Max 50MB)
                    </p>
                  </div>
                )}

                {trackUrl && (
                  <div className="mt-2 rounded-md border bg-muted p-4">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        onClick={togglePlayback}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-10 text-sm text-muted-foreground">
                              {formatTime(currentTime)}
                            </span>
                            <div className="relative flex-1">
                              <div className="h-1.5 w-full rounded-full bg-muted-foreground/20">
                                <div
                                  className="absolute h-1.5 rounded-full bg-primary"
                                  style={{
                                    width: `${(currentTime / duration) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                step="0.01"
                                value={currentTime}
                                onChange={(e) =>
                                  handleSliderChange([
                                    Number.parseFloat(e.target.value),
                                  ])
                                }
                                className="absolute inset-0 h-1.5 w-full cursor-pointer appearance-none bg-transparent"
                              />
                            </div>
                            <span className="w-10 text-right text-sm text-muted-foreground">
                              {formatTime(duration)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm">
                              {trackFile?.name || "Track preview"}
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={removeTrackFile}
                            >
                              <Trash2 className="h-4 w-4 text-red-700" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <audio
                      ref={audioRef}
                      src={trackUrl}
                      onTimeUpdate={updateTime}
                      onLoadedMetadata={handleLoadedMetadata}
                      onEnded={handleEnded}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">Album (Optional)</Label>
              <Popover open={trackAlbumsOpen} onOpenChange={setTrackAlbumsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={trackAlbumsOpen}
                    className="justify-between"
                    disabled={trackSelectedArtists.length === 0}
                  >
                    {trackSelectedAlbum
                      ? albums.find((album) => album.id === trackSelectedAlbum)
                          ?.title
                      : trackSelectedArtists.length === 0
                      ? "Select artists first"
                      : "Select album..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search albums..." />
                    <CommandList
                      className="max-h-[200px]"
                      onWheel={(e) => e.stopPropagation()}
                    >
                      <CommandEmpty>
                        {trackSelectedArtists.length === 0
                          ? "Select artists first"
                          : filteredAlbums.length === 0
                          ? "No albums found for selected artists"
                          : "No albums found"}
                      </CommandEmpty>
                      <CommandGroup>
                        {filteredAlbums.map((album) => {
                          const artist = artists.find(
                            (a) => a.id === album.artistId
                          );
                          return (
                            <CommandItem
                              key={album.id}
                              value={album.title}
                              onSelect={() => {
                                setTrackSelectedAlbum(
                                  album.id === trackSelectedAlbum
                                    ? null
                                    : album.id
                                );
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  trackSelectedAlbum === album.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <span>
                                {album.title}{" "}
                                <span className="text-muted-foreground">
                                  by {artist?.name}
                                </span>
                              </span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label className="font-medium">
                Cover Image{" "}
                {isTrackCoverImageRequired && (
                  <span className="text-destructive">*</span>
                )}
                {!isTrackCoverImageRequired && (
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    (Optional if album selected)
                  </span>
                )}
              </Label>
              <div>
                <input
                  ref={trackImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleTrackImageUpload}
                  className="hidden"
                />

                {!trackCoverImage && (
                  <div
                    onClick={triggerTrackImageInput}
                    className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-primary/50 hover:bg-muted"
                  >
                    <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      Click to upload cover image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG or WEBP (Max 5MB)
                    </p>
                  </div>
                )}

                {trackCoverImage && (
                  <div className="relative mt-2 inline-block">
                    <img
                      src={trackCoverImage || "/placeholder.svg"}
                      alt="Track cover preview"
                      className="h-48 w-48 rounded-md object-cover shadow-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={removeTrackImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleTrackSubmit}>Create Track</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
