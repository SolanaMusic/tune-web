"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function PlaylistsPage() {
  const { toast } = useToast();
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [newPlaylistData, setNewPlaylistData] = useState({
    name: "",
    description: "",
  });

  const playlists = [
    {
      id: "1",
      title: "Chill Vibes",
      description: "Relaxing tunes for your downtime",
      coverUrl: "/placeholder.svg?height=150&width=150",
      trackCount: 15,
    },
    {
      id: "2",
      title: "Workout Mix",
      description: "High energy tracks to keep you motivated",
      coverUrl: "/placeholder.svg?height=150&width=150",
      trackCount: 20,
    },
    {
      id: "3",
      title: "Focus Flow",
      description: "Concentration-enhancing instrumentals",
      coverUrl: "/placeholder.svg?height=150&width=150",
      trackCount: 18,
    },
    {
      id: "4",
      title: "Weekend Party",
      description: "Get the party started with these hits",
      coverUrl: "/placeholder.svg?height=150&width=150",
      trackCount: 25,
    },
    {
      id: "5",
      title: "Indie Discoveries",
      description: "Fresh indie tracks you'll love",
      coverUrl: "/placeholder.svg?height=150&width=150",
      trackCount: 12,
    },
    {
      id: "6",
      title: "Throwback Classics",
      description: "Nostalgic hits from the past",
      coverUrl: "/placeholder.svg?height=150&width=150",
      trackCount: 30,
    },
  ];

  const handleCreatePlaylist = () => {
    if (!newPlaylistData.name.trim()) {
      toast({
        title: "Playlist name required",
        description: "Please enter a name for your playlist.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "Playlist Created",
      description: `Your playlist "${newPlaylistData.name}" has been created.`,
      duration: 3000,
    });
    setIsCreatePlaylistOpen(false);
    setNewPlaylistData({ name: "", description: "" });
  };

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Playlists
          </h2>
          <p className="text-sm text-muted-foreground">
            Create and manage your music collections
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search playlists..."
              className="w-[200px] pl-8 md:w-[250px] lg:w-[300px]"
            />
          </div>
          <Dialog
            open={isCreatePlaylistOpen}
            onOpenChange={setIsCreatePlaylistOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="playlist-name">Playlist Name</Label>
                  <Input
                    id="playlist-name"
                    placeholder="My Awesome Playlist"
                    value={newPlaylistData.name}
                    onChange={(e) =>
                      setNewPlaylistData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="playlist-description">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="playlist-description"
                    placeholder="Describe your playlist..."
                    value={newPlaylistData.description}
                    onChange={(e) =>
                      setNewPlaylistData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreatePlaylistOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreatePlaylist}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All Playlists</TabsTrigger>
          <TabsTrigger value="created">Created by You</TabsTrigger>
          <TabsTrigger value="followed">Followed</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="border-none p-0 outline-none">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlists.map((playlist) => (
              <Link href={`/playlists/${playlist.id}`} key={playlist.id}>
                <Card className="overflow-hidden transition-all hover:bg-accent hover:text-accent-foreground">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate">
                        {playlist.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {playlist.trackCount} tracks
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent
          value="created"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlists.slice(0, 3).map((playlist) => (
              <Link href={`/playlists/${playlist.id}`} key={playlist.id}>
                <Card className="overflow-hidden transition-all hover:bg-accent hover:text-accent-foreground">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate">
                        {playlist.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {playlist.trackCount} tracks
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent
          value="followed"
          className="h-full flex-col border-none p-0 data-[state=active]:flex"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlists.slice(3).map((playlist) => (
              <Link href={`/playlists/${playlist.id}`} key={playlist.id}>
                <Card className="overflow-hidden transition-all hover:bg-accent hover:text-accent-foreground">
                  <CardContent className="p-0">
                    <div className="relative aspect-square">
                      <img
                        src={playlist.coverUrl || "/placeholder.svg"}
                        alt={playlist.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate">
                        {playlist.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {playlist.trackCount} tracks
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
