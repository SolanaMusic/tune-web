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
import { Music, Disc } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateAlbum } from "./create-album";
import { CreateTrack } from "./create-track";

interface CreateContentModalProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface CreateProps {
  onOpenChange: (open: boolean) => void;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  selectedArtists: string[];
  setSelectedArtists: React.Dispatch<React.SetStateAction<string[]>>;
  releaseDate: Date | undefined;
  setReleaseDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export function CreateContentModal({
  children,
  open,
  onOpenChange,
}: CreateContentModalProps) {
  const [activeTab, setActiveTab] = useState("album");

  // Album state
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumReleaseDate, setAlbumReleaseDate] = useState<Date | undefined>();
  const [albumSelectedArtists, setAlbumSelectedArtists] = useState<string[]>(
    []
  );
  const [albumSelectedTracks, setAlbumSelectedTracks] = useState<string[]>([]);

  // Track state
  const [trackTitle, setTrackTitle] = useState("");
  const [trackReleaseDate, setTrackReleaseDate] = useState<Date | undefined>();
  const [trackSelectedArtists, setTrackSelectedArtists] = useState<string[]>(
    []
  );
  const [trackSelectedGenres, setTrackSelectedGenres] = useState<string[]>([]);
  const [trackSelectedAlbum, setTrackSelectedAlbum] = useState<string | null>(
    null
  );

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
            <CreateAlbum
              onOpenChange={onOpenChange}
              title={albumTitle}
              setTitle={setAlbumTitle}
              selectedArtists={albumSelectedArtists}
              setSelectedArtists={setAlbumSelectedArtists}
              releaseDate={albumReleaseDate}
              setReleaseDate={setAlbumReleaseDate}
              description={albumDescription}
              setDescription={setAlbumDescription}
              selectedItems={albumSelectedTracks}
              setSelectedItems={setAlbumSelectedTracks}
            />
          </TabsContent>

          <TabsContent value="track" className="mt-4 space-y-4">
            <CreateTrack
              onOpenChange={onOpenChange}
              title={trackTitle}
              setTitle={setTrackTitle}
              selectedArtists={trackSelectedArtists}
              setSelectedArtists={setTrackSelectedArtists}
              releaseDate={trackReleaseDate}
              setReleaseDate={setTrackReleaseDate}
              selectedItems={trackSelectedGenres}
              setSelectedItems={setTrackSelectedGenres}
              selectedGenres={trackSelectedGenres}
              setSelectedGenres={setTrackSelectedGenres}
              selectedAlbum={trackSelectedAlbum}
              setSelectedAlbum={setTrackSelectedAlbum}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
