"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Check, ChevronsUpDown, X, CalendarIcon, Upload } from "lucide-react";
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

interface CreateAlbumProps extends CreateProps {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

export function CreateAlbum({
  onOpenChange,
  title,
  setTitle,
  selectedArtists,
  setSelectedArtists,
  releaseDate,
  setReleaseDate,
  description,
  setDescription,
  selectedItems,
  setSelectedItems,
}: CreateAlbumProps) {
  const [artists, setArtists] = useState<any[]>([]);
  const [tracks, setTracks] = useState<any[]>([]);
  const [userArtist, setUserArtist] = useState<any>();
  const [albumArtistsOpen, setAlbumArtistsOpen] = useState(false);
  const [albumTracksOpen, setAlbumTracksOpen] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const artistsPromise = axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}artists`
        );
        const userArtistPromise = user
          ? axios.get(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}artists/by-userId/${user.id}`
            )
          : null;

        const [artistsResponse, userArtistResponse] = await Promise.all([
          artistsPromise,
          userArtistPromise,
        ]);

        setArtists(artistsResponse.data);

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
      setTracks([]);
      return;
    }

    const fetchTracks = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/by-artists`,
          {
            params: { artistIds: selectedArtists },
            paramsSerializer: serializeParams,
          }
        );
        setTracks(response.data);
      } catch (error) {
        console.error("Error fetching tracks", error);
      }
    };
    fetchTracks();
  }, [selectedArtists]);

  const handleAlbumImageUpload = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleFileUpload(e, setCoverImage);

  const removeAlbumImage = () => removeFile(fileInputRef, setCoverImage);

  const triggerAlbumFileInput = () => triggerFileInput(fileInputRef);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (selectedArtists.length === 0)
      newErrors.artists = "At least one artist must be selected";
    if (!releaseDate) newErrors.releaseDate = "Release date is required";
    if (!coverImage) newErrors.coverImage = "Cover image is required";

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

      if (releaseDate)
        formData.append("ReleaseDate", releaseDate.toISOString());

      const file = fileInputRef.current?.files?.[0];
      if (file) formData.append("Cover", file);

      formData.append("Description", description);
      selectedItems.forEach((id) => formData.append("TrackIds", id));

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}albums`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setTitle("");
      setSelectedArtists([]);
      setReleaseDate(new Date());
      setCoverImage(null);
      setDescription("");
      setSelectedItems([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      onOpenChange(false);
    } catch (error) {
      console.error("Error creating album:", error);
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
        <Popover open={albumArtistsOpen} onOpenChange={setAlbumArtistsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={albumArtistsOpen}
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
          Cover Image <span className="text-destructive">*</span>
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAlbumImageUpload}
          className="hidden"
        />
        {!coverImage && (
          <div
            onClick={triggerAlbumFileInput}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-primary/50 hover:bg-muted",
              errors.coverImage ? "border-destructive" : ""
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
              onClick={removeAlbumImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="album-description" className="font-medium">
          Description (Optional)
        </Label>
        <Textarea
          id="album-description"
          placeholder="Enter album description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
              disabled={selectedArtists.length === 0}
            >
              {selectedItems.length > 0
                ? `${selectedItems.length} track${
                    selectedItems.length > 1 ? "s" : ""
                  } selected`
                : selectedArtists.length === 0 || !userArtist
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
                  {selectedArtists.length === 0
                    ? "Select artists first"
                    : tracks.length === 0
                    ? "No tracks found for selected artists"
                    : "No tracks found"}
                </CommandEmpty>
                <CommandGroup>
                  {tracks
                    .filter((track) => track.album === null)
                    .map((track) => (
                      <CommandItem
                        key={track.id}
                        value={track.title}
                        onSelect={() => {
                          setSelectedItems((prev) =>
                            prev.includes(track.id)
                              ? prev.filter((id) => id !== track.id)
                              : [...prev, track.id]
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedItems.includes(track.id)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span>
                          {track.title}
                          {" by "}
                          <span className="text-muted-foreground text-xs">
                            {track.artists.map((a: any) => a.name).join(", ")}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedItems.map((trackId) => {
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
                      setSelectedItems((prev) =>
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
    </>
  );
}
