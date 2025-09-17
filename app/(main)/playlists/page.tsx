"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusIcon,
  SearchIcon,
  ImageIcon,
  X,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useUserStore } from "@/stores/UserStore";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PlaylistsPage() {
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistData, setNewPlaylistData] = useState({
    name: "",
    isPublic: true,
    coverImage: undefined as string | undefined,
    coverFile: undefined as File | undefined,
  });
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [errors, setErrors] = useState();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditPlaylistOpen, setIsEditPlaylistOpen] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/get-user-playlists/${user?.id}`
        );
        setPlaylists(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaylists();
  }, [user]);

  const validate = () => {
    let error = "";

    if (!newPlaylistData.name.trim()) {
      error = "Playlist name is required.";
    } else if (newPlaylistData.name.length < 3) {
      error = "Playlist name must be at least 3 characters long.";
    }

    setErrors(error);
    return error === "";
  };

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlaylist = async () => {
    if (!validate() || !user) return;

    setIsCreatePlaylistOpen(false);

    try {
      const formData = new FormData();
      formData.append("name", newPlaylistData.name);
      formData.append("ownerId", String(user.id));
      formData.append("isPublic", JSON.stringify(newPlaylistData.isPublic));
      if (newPlaylistData.coverFile) {
        formData.append("coverFile", newPlaylistData.coverFile);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPlaylists((prev) => [response.data, ...prev]);
      setNewPlaylistData({
        name: "",
        isPublic: true,
        coverImage: undefined,
        coverFile: undefined,
      });
      setErrors("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePlaylist = (id: number) => {
    const playlist = playlists.find((x) => x.id === id);
    setPlaylistToDelete(playlist);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdatePlaylist = (id: number) => {
    const playlist = playlists.find((x) => x.id === id);
    setEditingPlaylist(playlist);
    setIsEditPlaylistOpen(true);
  };

  const deletePlaylist = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/${playlistToDelete.id}`
      );

      setPlaylists((prev) =>
        prev.filter((playlist) => playlist.id !== playlistToDelete.id)
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const updatePlaylist = async () => {
    try {
      if (!editingPlaylist) return;

      const formData = new FormData();
      formData.append("Name", editingPlaylist.name);
      formData.append("IsPublic", String(editingPlaylist.isPublic));

      if (editingPlaylist.coverFile) {
        formData.append("CoverFile", editingPlaylist.coverFile);
      } else if (
        !editingPlaylist.coverFile &&
        !editingPlaylist.coverImage &&
        !editingPlaylist.coverUrl
      ) {
        formData.append("RemoveCover", "true");
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}playlists/${editingPlaylist.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedPlaylist = response.data;

      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsEditPlaylistOpen(false);
    }
  };

  const parseDuration = (duration: string) => {
    const parts = duration.split(":").map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
  };

  const PlaylistCard = ({ playlist }: { playlist: (typeof playlists)[0] }) => {
    const totalSeconds = playlist.tracks.reduce(
      (acc, track) => acc + parseDuration(track.duration),
      0
    );

    const totalDuration = formatDuration(totalSeconds);
    const trackText = playlist.tracks.length === 1 ? "track" : "tracks";

    return (
      <div className="group relative">
        <Link href={`/playlists/${playlist.id}`}>
          <Card className="overflow-hidden transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-md">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <img
                  src={
                    playlist.coverUrl
                      ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${playlist.coverUrl}`
                      : "/placeholder.svg"
                  }
                  alt={playlist.name}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "absolute top-2 left-2 px-2 py-1 text-xs rounded-full font-medium text-white",
                      playlist.isPublic
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-500 dark:text-gray-100"
                    )}
                  >
                    {playlist.isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="font-semibold truncate text-sm sm:text-base">
                  {playlist.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  {playlist.tracks.length} {trackText} • {totalDuration}
                </p>
                <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                  Last updated:{" "}
                  <time dateTime={playlist.updatedDate} className="font-medium">
                    {new Date(playlist.updatedDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </time>
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleUpdatePlaylist(playlist.id)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Playlist
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeletePlaylist(playlist.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  const PlaylistListItem = ({
    playlist,
  }: {
    playlist: (typeof playlists)[0];
  }) => {
    const totalSeconds = playlist.tracks.reduce(
      (acc, track) => acc + parseDuration(track.duration),
      0
    );

    const totalDuration = formatDuration(totalSeconds);
    const trackText = playlist.tracks.length === 1 ? "track" : "tracks";

    return (
      <div className="group relative">
        <Link href={`/playlists/${playlist.id}`}>
          <Card className="group transition-all hover:bg-accent hover:text-accent-foreground">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                  <img
                    src={
                      playlist.coverUrl
                        ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${playlist.coverUrl}`
                        : "/placeholder.svg"
                    }
                    alt={playlist.name}
                    className="object-cover w-full h-full rounded transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate text-sm sm:text-base">
                    {playlist.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>
                      {playlist.tracks.length} {trackText}
                    </span>
                    <span>•</span>
                    <span>{totalDuration}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">
                      Last updated:{" "}
                      <time
                        dateTime={playlist.updatedDate}
                        className="font-medium"
                      >
                        {new Date(playlist.updatedDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs",
                      playlist.isPublic
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-500 dark:text-gray-100"
                    )}
                  >
                    {playlist.isPublic ? "Public" : "Private"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={(e) => e.preventDefault()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleUpdatePlaylist(playlist.id)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Playlist
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeletePlaylist(playlist.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Your Playlists
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Create and manage your music collections
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-[200px] md:w-[250px] lg:w-[300px] pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Dialog
              open={isCreatePlaylistOpen}
              onOpenChange={(open) => {
                setIsCreatePlaylistOpen(open);
                if (!open) {
                  setErrors("");
                  setNewPlaylistData({
                    name: "",
                    isPublic: true,
                    coverImage: undefined,
                    coverFile: undefined,
                  });
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Create Playlist</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto">
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="playlist-name">Playlist Name</Label>
                    <Input
                      id="playlist-name"
                      placeholder="My Playlist"
                      value={newPlaylistData.name}
                      onChange={(e) =>
                        setNewPlaylistData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                    {errors && <p className="text-sm text-red-500">{errors}</p>}
                  </div>
                  <div className="py-1">
                    <Separator />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col justify-center">
                      <Label htmlFor="playlist-public">Public</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Everyone can see this playlist
                      </p>
                    </div>
                    <Switch
                      id="playlist-public"
                      checked={newPlaylistData.isPublic}
                      onCheckedChange={(checked) =>
                        setNewPlaylistData((prev) => ({
                          ...prev,
                          isPublic: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="py-1">
                    <Separator />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="playlist-cover">
                      Cover Image (optional)
                    </Label>
                    <div className="space-y-2">
                      <input
                        type="file"
                        id="playlist-cover"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setNewPlaylistData((prev) => ({
                                ...prev,
                                coverImage: e.target?.result as string,
                                coverFile: file,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {!newPlaylistData.coverImage ? (
                        <div
                          onClick={() =>
                            document.getElementById("playlist-cover")?.click()
                          }
                          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center">
                              <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Upload cover image
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={
                              newPlaylistData.coverImage || "/placeholder.svg"
                            }
                            alt="Playlist cover preview"
                            className="w-full h-100 sm:h-100 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() =>
                              setNewPlaylistData((prev) => ({
                                ...prev,
                                coverImage: undefined,
                                coverFile: undefined,
                              }))
                            }
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreatePlaylistOpen(false), setErrors("");
                    }}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePlaylist}
                    className="w-full sm:w-auto"
                  >
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="w-[90vw] rounded">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{playlistToDelete?.name}"?
              <p>This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPlaylistToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deletePlaylist}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isEditPlaylistOpen && editingPlaylist && (
        <Dialog open={isEditPlaylistOpen} onOpenChange={setIsEditPlaylistOpen}>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-playlist-name">Playlist Name</Label>
                <Input
                  id="edit-playlist-name"
                  placeholder="My Playlist"
                  value={editingPlaylist.name}
                  onChange={(e) =>
                    setEditingPlaylist((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="py-1">
                <Separator />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col justify-center">
                  <Label htmlFor="playlist-public">Public</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Everyone can see this playlist
                  </p>
                </div>
                <Switch
                  id="playlist-public"
                  checked={editingPlaylist.isPublic}
                  onCheckedChange={(checked) =>
                    setEditingPlaylist((prev) => ({
                      ...prev,
                      isPublic: checked,
                    }))
                  }
                />
              </div>
              <div className="py-1">
                <Separator />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-playlist-cover">
                  Cover Image (optional)
                </Label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="edit-playlist-cover"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setEditingPlaylist((prev) => ({
                            ...prev,
                            coverImage: e.target?.result as string,
                            coverFile: file,
                            coverUrl: undefined,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                  {!editingPlaylist.coverImage && !editingPlaylist.coverUrl ? (
                    <div
                      onClick={() =>
                        document.getElementById("edit-playlist-cover")?.click()
                      }
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Upload cover image
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={
                          editingPlaylist.coverImage ||
                          (editingPlaylist.coverUrl
                            ? `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${editingPlaylist.coverUrl}`
                            : "/placeholder.svg")
                        }
                        alt="Playlist cover preview"
                        className="w-full h-100 sm:h-100 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() =>
                          setEditingPlaylist((prev) => ({
                            ...prev,
                            coverImage: undefined,
                            coverFile: undefined,
                            coverUrl: undefined,
                          }))
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditPlaylistOpen(false);
                  setEditingPlaylist(null);
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={updatePlaylist} className="w-full sm:w-auto">
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Tabs defaultValue="all" className="mt-4 sm:mt-6">
        <TabsList className="w-fit">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All Playlists
          </TabsTrigger>
          <TabsTrigger value="created" className="text-xs sm:text-sm">
            Created by You
          </TabsTrigger>
          <TabsTrigger value="followed" className="text-xs sm:text-sm">
            Followed
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="all"
          className="border-none p-0 outline-none mt-4 sm:mt-6"
        >
          {filteredPlaylists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No playlists found matching your search.
              </p>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
                  {filteredPlaylists.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredPlaylists.map((playlist) => (
                    <PlaylistListItem key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent
          value="created"
          className="h-full flex-col border-none p-0 data-[state=active]:flex mt-4 sm:mt-6"
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {filteredPlaylists.slice(0, 3).map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPlaylists.slice(0, 3).map((playlist) => (
                <PlaylistListItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="followed"
          className="h-full flex-col border-none p-0 data-[state=active]:flex mt-4 sm:mt-6"
        >
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {filteredPlaylists.slice(3).map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPlaylists.slice(3).map((playlist) => (
                <PlaylistListItem key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
