"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Compass,
  Library,
  ListMusic,
  Users,
  Heart,
  ShoppingBag,
  Hammer,
  FilePlus,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CreateContentModal } from "./modals/create-content-modal";
import { useUserStore } from "@/stores/UserStore";

export function Sidebar() {
  const pathname = usePathname();
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);
  const { user } = useUserStore();

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

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <aside
      className="hidden w-64 flex-shrink-0 border-r bg-card md:block"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex h-full flex-col">
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
        </div>

        {user && user?.role !== "User" && (
          <div className="px-4 py-2">
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Hammer className="h-4 w-4" />
              <span>Artist Tools</span>
            </div>
            <div className="mt-2 space-y-1">
              <Button
                variant={
                  pathname.startsWith("/artist-nft-collections")
                    ? "default"
                    : "ghost"
                }
                className="w-full justify-start"
                asChild
              >
                <Link href="/artist-nft-collections/1">
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  NFT Collections
                </Link>
              </Button>

              <CreateContentModal
                open={isCreateContentOpen}
                onOpenChange={setIsCreateContentOpen}
              >
                <Button variant="ghost" className="w-full justify-start">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Create Content
                </Button>
              </CreateContentModal>
            </div>
          </div>
        )}

        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <ListMusic className="h-4 w-4" />
              <span>Your Library</span>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 p-2">
            <Button
              variant={pathname === "/playlists/liked" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/playlists/liked">
                <Heart className="mr-2 h-4 w-4" />
                Liked Songs
              </Link>
            </Button>
            <Button
              variant={pathname === "/liked-nfts" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/liked-nfts">
                <Heart className="mr-2 h-4 w-4" />
                Liked NFTs
              </Link>
            </Button>

            <Button
              variant={pathname === "/playlists" ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href="/playlists">
                <ListMusic className="mr-2 h-4 w-4" />
                Your Playlists
              </Link>
            </Button>

            <Collapsible className="w-full">
              <CollapsibleContent>
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
              </CollapsibleContent>
            </Collapsible>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
