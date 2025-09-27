"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import { useState } from "react";
import { CreateContentModal } from "./modals/create-content/create-content-modal";
import { useUserStore } from "@/stores/UserStore";

export function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserStore();
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  function NavButton({ href, icon, label, isActive }) {
    return (
      <Button
        variant={isActive(href) ? "default" : "ghost"}
        className="w-full justify-start"
        asChild
      >
        <Link href={href}>
          <div className="flex items-center">
            {icon && <span className="mr-2 h-5 w-5">{icon}</span>}
            {label}
          </div>
        </Link>
      </Button>
    );
  }

  function SectionLabel({ icon, label }) {
    return (
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col bg-card"
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <Image src="/favicon.png" alt="favicon" width={40} height={40} />
          </div>
          <span className="text-lg font-semibold">Tune</span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-1">
          <NavButton
            href="/"
            icon={<Home />}
            label="Home"
            isActive={isActive}
          />
          <NavButton
            href="/explore"
            icon={<Compass />}
            label="Explore"
            isActive={isActive}
          />
          <NavButton
            href="/library"
            icon={<Library />}
            label="Library"
            isActive={isActive}
          />
          <NavButton
            href="/nft-marketplace"
            icon={<ShoppingBag />}
            label="NFT Market"
            isActive={isActive}
          />
          <NavButton
            href="/subscriptions"
            icon={<Users />}
            label="Subscription"
            isActive={isActive}
          />
        </div>

        {user && user?.role !== "User" && (
          <div className="px-4 py-4">
            <SectionLabel
              icon={<Hammer className="h-4 w-4" />}
              label="Artist Tools"
            />
            <div className="mt-2 space-y-1">
              <NavButton
                href="/artist-nft-collections/1"
                icon={<LayoutGrid />}
                label="NFT Collections"
                isActive={(href) => pathname.startsWith(href)}
              />
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
          <SectionLabel
            icon={<ListMusic className="h-4 w-4" />}
            label="Your Library"
          />
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1 p-2">
            <NavButton
              href="/liked-nfts"
              icon={<Heart />}
              label="Liked NFTs"
              isActive={isActive}
            />
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/playlists")}
            >
              <ListMusic className="mr-2 h-4 w-4" />
              Your Playlists
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
