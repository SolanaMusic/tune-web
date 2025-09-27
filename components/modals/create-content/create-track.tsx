"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Check, ChevronsUpDown, X, CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import {
  cn,
  serializeParams,
  handleFileUpload,
  removeFile,
  triggerFileInput,
} from "@/lib/utils";
import { useUserStore } from "@/stores/UserStore";
import { CreateProps } from "./create-content-modal";

interface CreateTrackProps extends CreateProps {
  onOpenChange: (open: boolean) => void;
  selectedGenres: string[];
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>;
  selectedAlbum: string | null;
  setSelectedAlbum: React.Dispatch<React.SetStateAction<string | null>>;
}

export function CreateTrack({
  onOpenChange,
  title,
  setTitle,
  selectedArtists,
  setSelectedArtists,
  selectedGenres,
  setSelectedGenres,
  releaseDate,
  setReleaseDate,
  selectedItems,
  setSelectedItems,
  selectedAlbum,
  setSelectedAlbum,
}: CreateTrackProps) {
  const [artists, setArtists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [userArtist, setUserArtist] = useState<any>();
  const [trackArtistsOpen, setTrackArtistsOpen] = useState(false);
  const [trackGenresOpen, setTrackGenresOpen] = useState(false);
  const [trackAlbumOpen, setTrackAlbumOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [trackFile, setTrackFile] = useState<File | null>(null);
  const [trackPreview, setTrackPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const trackFileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistsPromise = axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}artists`
        );
        const genresPromise = axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}genres`
        );

        const userArtistPromise = user
          ? axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}artists/by-userId/${user.id}`
            )
          : null;

        const [artistsResponse, genresResponse, userArtistResponse] =
          await Promise.all([artistsPromise, genresPromise, userArtistPromise]);

        setArtists(artistsResponse.data);
        setGenres(genresResponse.data);

        if (user && userArtistResponse) {
          setUserArtist(userArtistResponse.data);
          setSelectedArtists([userArtistResponse.data.id]);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedArtists.length === 0) {
      setAlbums([]);
      return;
    }

    const fetchAlbums = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}albums/by-artists`,
          {
            params: { artistIds: selectedArtists },
            paramsSerializer: serializeParams,
          }
        );
        setAlbums(response.data);
      } catch (error) {
        console.error("Error fetching albums", error);
      }
    };
    fetchAlbums();
  }, [selectedArtists]);

  const handleTrackImageUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFileUpload(e, setCoverImage);

  const removeTrackImage = () => removeFile(coverFileInputRef, setCoverImage);

  const triggerTrackFileInput = () => triggerFileInput(coverFileInputRef);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (selectedArtists.length === 0)
      newErrors.artists = "At least one artist must be selected";
    if (selectedGenres.length === 0)
      newErrors.genres = "At least one genre must be selected";
    if (!releaseDate) newErrors.releaseDate = "Release date is required";
    if (!trackFile) newErrors.trackFile = "Track file is required";
    if (!coverImage && !selectedAlbum)
      newErrors.coverOrAlbum = "Either cover image or album must be selected";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAlbumSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("Title", title);

      selectedArtists.forEach((id) =>
        formData.append("ArtistIds", id.toString())
      );

      selectedGenres.forEach((genreName) => {
        const genre = genres.find((g) => g.name === genreName);
        if (genre) formData.append("GenreIds", genre.id.toString());
      });

      if (releaseDate)
        formData.append("ReleaseDate", releaseDate.toISOString());

      const coverFile = coverFileInputRef.current?.files?.[0];
      if (coverFile) formData.append("Image", coverFile);

      if (trackFile) formData.append("TrackFile", trackFile);
      selectedItems.forEach((id) => formData.append("TrackIds", id));

      if (selectedAlbum) {
        formData.append("AlbumId", selectedAlbum);
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setTitle("");
      setSelectedArtists([]);
      setSelectedGenres([]);
      setReleaseDate(new Date());
      setCoverImage(null);
      setTrackFile(null);
      setTrackPreview(null);
      setSelectedItems([]);
      if (coverFileInputRef.current) coverFileInputRef.current.value = "";
      if (trackFileInputRef.current) trackFileInputRef.current.value = "";

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating track", error);
    }
  };

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="album-title" className="font-medium">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="album-title"
          placeholder="Enter album title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label className="font-medium">
          Artists <span className="text-destructive">*</span>
        </Label>
        <Popover open={trackArtistsOpen} onOpenChange={setTrackArtistsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={trackArtistsOpen}
              className={cn(
                "justify-between",
                errors.artists ? "border-destructive" : ""
              )}
            >
              {selectedArtists.length > 0
                ? `${selectedArtists.length} artist${
                    selectedArtists.length > 1 ? "s" : ""
                  } selected`
                : "Select artists..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search artists..." />
              <CommandList className="max-h-[200px] overflow-y-auto">
                <CommandEmpty>No artists found.</CommandEmpty>
                <CommandGroup>
                  {artists.map((artist) => (
                    <CommandItem
                      key={artist.id}
                      value={artist.name}
                      onSelect={() => {
                        setSelectedArtists((prev) => {
                          const alreadySelected = prev.includes(artist.id);
                          if (alreadySelected && artist.id === userArtist?.id) {
                            return prev;
                          }

                          return alreadySelected
                            ? prev.filter((id) => id !== artist.id)
                            : [...prev, artist.id];
                        });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedArtists.includes(artist.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {artist.name}
                      {artist.id === userArtist?.id && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (You)
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedArtists.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedArtists.map((artistId) => {
              const artist = artists.find((a) => a.id === artistId);
              const isUserArtist = artistId === userArtist?.id;

              return (
                <Badge
                  key={artistId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {artist?.name}
                  {!isUserArtist && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0"
                      onClick={() =>
                        setSelectedArtists((prev) =>
                          prev.filter((id) => id !== artistId)
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
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
              className={cn(
                "justify-between",
                errors.genres ? "border-destructive" : ""
              )}
            >
              {selectedGenres.length > 0
                ? `${selectedGenres.length} genre${
                    selectedGenres.length > 1 ? "s" : ""
                  } selected`
                : "Select genres..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search genres..." />
              <CommandList className="max-h-[200px] overflow-y-auto">
                <CommandEmpty>No genres found.</CommandEmpty>
                <CommandGroup>
                  {genres.map((genre) => (
                    <CommandItem
                      key={genre.id}
                      value={genre.name}
                      onSelect={() => {
                        setSelectedGenres((prev) =>
                          prev.includes(genre.name)
                            ? prev.filter((g) => g !== genre.name)
                            : [...prev, genre.name]
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedGenres.includes(genre.name)
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

        {errors.genres && (
          <p className="text-destructive text-sm">{errors.genres}</p>
        )}

        {selectedGenres.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedGenres.map((genreName) => (
              <Badge
                key={genreName}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {genreName}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0"
                  onClick={() =>
                    setSelectedGenres((prev) =>
                      prev.filter((g) => g !== genreName)
                    )
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
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
                !releaseDate && "text-muted-foreground",
                errors.releaseDate ? "border-destructive" : ""
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {releaseDate ? format(releaseDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={releaseDate}
              onSelect={setReleaseDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label className="font-medium">
          Track File <span className="text-destructive">*</span>
        </Label>
        <input
          ref={trackFileInputRef}
          type="file"
          accept="audio/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setTrackFile(file);
              const url = URL.createObjectURL(file);
              setTrackPreview(url);
            }
          }}
          className="hidden"
        />
        {!trackFile && (
          <div
            onClick={() => trackFileInputRef.current?.click()}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-primary/50 hover:bg-muted",
              errors.trackFile ? "border-destructive" : ""
            )}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Click to upload track</p>
            <p className="text-xs text-muted-foreground">
              MP3, WAV, etc. (Max 20MB)
            </p>
          </div>
        )}
        {errors.trackFile && (
          <p className="text-destructive text-sm">{errors.trackFile}</p>
        )}
        {trackFile && (
          <div className="flex flex-col gap-2">
            <audio src={trackPreview!} controls className="w-full" />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setTrackFile(null);
                setTrackPreview(null);
                if (trackFileInputRef.current)
                  trackFileInputRef.current.value = "";
              }}
            >
              Remove track
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label className="font-medium">
          Cover Image <span className="text-destructive">*</span>
        </Label>
        <input
          ref={coverFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleTrackImageUpload}
          className="hidden"
        />
        {!coverImage && (
          <div
            onClick={triggerTrackFileInput}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-primary/50 hover:bg-muted",
              errors.coverOrAlbum ? "border-destructive" : ""
            )}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium">Click to upload album cover</p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG or WEBP (Max 5MB)
            </p>
          </div>
        )}
        {coverImage && (
          <div className="relative mt-2 inline-block">
            <img
              src={coverImage || "/placeholder.svg"}
              alt="Album cover preview"
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

        {errors.coverOrAlbum && (
          <p className="text-destructive text-sm">{errors.coverOrAlbum}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label className="font-medium">Album (Optional)</Label>
        <Popover open={trackAlbumOpen} onOpenChange={setTrackAlbumOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={trackAlbumOpen}
              className="justify-between"
              disabled={selectedArtists.length === 0}
            >
              {selectedAlbum
                ? albums.find((a) => a.id === selectedAlbum)?.title
                : "Select album..."}
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
                  {selectedArtists.length === 0
                    ? "Select artists first"
                    : albums.length === 0
                    ? "No tracks found for selected artists"
                    : "No tracks found"}
                </CommandEmpty>
                <CommandGroup>
                  {albums.map((album) => (
                    <CommandItem
                      key={album.id}
                      value={album.title}
                      onSelect={() =>
                        setSelectedAlbum((prev) =>
                          prev === album.id ? null : album.id
                        )
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedAlbum === album.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <span>
                        {album.title}{" "}
                        <span className="text-muted-foreground text-xs">
                          {album.artists.map((a: any) => a.name).join(", ")}
                        </span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleAlbumSubmit}>Create Track</Button>
      </div>
    </>
  );
}
