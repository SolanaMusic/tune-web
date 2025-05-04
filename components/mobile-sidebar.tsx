"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Compass,
  Library,
  ListMusic,
  Users,
  PlusCircle,
  Heart,
  ShoppingBag,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [newPlaylistData, setNewPlaylistData] = useState({
    name: "",
    description: "",
  });

  const playlists = [
    { id: "1", name: "Discover Weekly" },
    { id: "2", name: "Release Radar" },
    { id: "3", name: "Chill Vibes" },
    { id: "4", name: "Workout Mix" },
    { id: "5", name: "Road Trip" },
    { id: "6", name: "Study Focus" },
    { id: "7", name: "Throwback Hits" },
    { id: "8", name: "Morning Coffee" },
  ];

  const handleCreatePlaylist = () => {
    toast({
      title: "Playlist Created",
      description: `Your playlist "${newPlaylistData.name}" has been created.`,
      duration: 3000,
    });
    setIsCreatePlaylistOpen(false);
    setNewPlaylistData({ name: "", description: "" });
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <svg
              width="16"
              height="16"
              viewBox="0 0 25 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.6567 0C16.3765 2.87227e-06 16.0995 0.0647343 15.8444 0.190583C15.5892 0.316431 15.3625 0.50047 15.1805 0.730001L12.4694 4.13L18.1327 4.16C19.8672 4.16779 21.5435 4.70329 22.9192 5.682C24.2949 6.66072 25.2894 8.03376 25.7524 9.59753C26.2153 11.1613 26.1234 12.8273 25.4902 14.3334C24.857 15.8394 23.7162 17.1014 22.2474 17.9L19.7164 13.33C19.9985 13.0755 20.2183 12.7552 20.3579 12.3942C20.4974 12.0332 20.5529 11.6414 20.5204 11.2519C20.4878 10.8624 20.3682 10.4858 20.1704 10.1538C19.9727 9.82172 19.7024 9.54325 19.3804 9.34L12.4694 16.77L16.7834 21.92C17.0185 22.1885 17.3355 22.3647 17.6827 22.4188C18.0298 22.4729 18.3845 22.4017 18.6867 22.2164C18.989 22.0311 19.2214 21.7435 19.3459 21.4032C19.4704 21.063 19.4797 20.6908 19.3724 20.345L22.0834 17.92C23.9093 16.9192 25.3434 15.3605 26.1656 13.495C26.9878 11.6296 27.1534 9.55911 26.6366 7.60553C26.1198 5.65195 24.9538 3.92635 23.3204 2.70118C21.687 1.47601 19.6815 0.82473 17.6234 0.845001L16.6567 0Z"
                fill="white"
              />
              <path
                d="M9.30333 0.09C8.97245 0.0119914 8.62781 0.0386417 8.31459 0.166422C8.00137 0.294201 7.73573 0.517288 7.55331 0.805L4.93331 4.845C2.32414 5.70621 0.232201 7.65491 -0.754116 10.1476C-1.74043 12.6402 -1.5135 15.4359 -0.133311 17.76L2.49669 14.5C2.19773 13.7208 2.19615 12.8587 2.4922 12.078C2.78825 11.2973 3.35985 10.6533 4.09669 10.27L10.6967 21.23C10.9321 21.5956 11.3006 21.8592 11.7223 21.969C12.144 22.0788 12.5886 22.0275 12.9667 21.825C13.3447 21.6225 13.6303 21.2838 13.7651 20.8742C13.8999 20.4646 13.874 20.0199 13.6917 19.63L7.13331 8.625C6.98508 8.35855 6.9025 8.06401 6.88994 7.76151C6.87738 7.45901 6.93511 7.15828 7.05831 6.88034C7.18152 6.60239 7.36665 6.35426 7.59907 6.15424C7.83148 5.95422 8.10549 5.80704 8.40001 5.725L12.5333 12.255L14.5233 14.675L15.2267 15.535C15.3631 15.7088 15.5349 15.8511 15.73 15.9526C15.9251 16.054 16.1393 16.1124 16.3582 16.1241C16.5771 16.1357 16.796 16.1004 17.0002 16.02C17.2043 15.9396 17.3894 15.816 17.5433 15.6575C17.6972 15.499 17.8163 15.3093 17.8925 15.1012C17.9687 14.8931 18.0005 14.6714 17.9858 14.4501C17.9712 14.2288 17.9103 14.0131 17.8069 13.817C17.7035 13.6209 17.5599 13.4488 17.3853 13.312L15.3333 10.82L12.3533 6.115L9.30333 0.09Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold">Tune</span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="space-y-1">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Home
              </Link>
            </Button>
            <Button
              variant={isActive("/explore") ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/explore">
                <Compass className="mr-2 h-5 w-5" />
                Explore
              </Link>
            </Button>
            <Button
              variant={isActive("/library") ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/library">
                <Library className="mr-2 h-5 w-5" />
                Library
              </Link>
            </Button>
            <Button
              variant={isActive("/nft-marketplace") ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/nft-marketplace">
                <ShoppingBag className="mr-2 h-5 w-5" />
                NFT Market
              </Link>
            </Button>
            <Button
              variant={isActive("/subscriptions") ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/subscriptions">
                <Users className="mr-2 h-5 w-5" />
                Subscription
              </Link>
            </Button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                <ListMusic className="h-4 w-4" />
                <span>Your Library</span>
              </div>
              <Dialog
                open={isCreatePlaylistOpen}
                onOpenChange={setIsCreatePlaylistOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Playlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="playlist-name-mobile">
                        Playlist Name
                      </Label>
                      <Input
                        id="playlist-name-mobile"
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
                      <Label htmlFor="playlist-description-mobile">
                        Description (optional)
                      </Label>
                      <Textarea
                        id="playlist-description-mobile"
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

            <div className="space-y-1 pt-2">
              <Button
                variant={pathname === "/playlists/liked" ? "default" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/playlists/liked">
                  <Heart className="mr-2 h-4 w-4 text-primary" />
                  Liked Songs
                </Link>
              </Button>
              <Button
                variant={pathname === "/liked-nfts" ? "default" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link href="/liked-nfts">
                  <Heart className="mr-2 h-4 w-4 text-primary" />
                  Liked NFTs
                </Link>
              </Button>

              {playlists.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant={
                    pathname === `/playlists/${playlist.id}`
                      ? "default"
                      : "ghost"
                  }
                  className="w-full justify-start text-sm font-normal"
                  asChild
                >
                  <Link href={`/playlists/${playlist.id}`}>
                    {playlist.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <Button
              variant={pathname === "/wallet" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/wallet">
                <Wallet className="mr-2 h-5 w-5" />
                My NFTs
              </Link>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
