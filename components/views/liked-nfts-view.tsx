"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function LikedNFTsView() {
  const router = useRouter();
  const { toast } = useToast();
  const [filterValue, setFilterValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");

  const likedNfts = [
    {
      id: "nft1",
      title: "Cosmic Harmonies #12",
      artist: "Stellar Sound",
      type: "Album",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "0.45 SOL",
    },
    {
      id: "nft2",
      title: "Digital Dreamscape #7",
      artist: "Neon Collective",
      type: "Single",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "1.2 SOL",
    },
    {
      id: "nft3",
      title: "Rhythmic Revolution #23",
      artist: "Beat Masters",
      type: "Collectible",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "0.8 SOL",
    },
    {
      id: "nft4",
      title: "Sonic Serenity #5",
      artist: "Harmony Hub",
      type: "Album",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "0.6 SOL",
    },
    {
      id: "nft5",
      title: "Melodic Memories #18",
      artist: "Echo Ensemble",
      type: "Single",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "0.35 SOL",
    },
    {
      id: "nft6",
      title: "Harmonic Horizons #3",
      artist: "Stellar Sound",
      type: "Collectible",
      imageUrl: "/placeholder.svg?height=200&width=200",
      price: "1.5 SOL",
    },
  ];

  const filteredNfts = likedNfts
    .filter((nft) => {
      if (filterValue) {
        const searchLower = filterValue.toLowerCase();
        return (
          nft.title.toLowerCase().includes(searchLower) ||
          nft.artist.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter((nft) => {
      if (typeFilter !== "all") {
        return nft.type.toLowerCase() === typeFilter.toLowerCase();
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "price-low") {
        return Number.parseFloat(a.price) - Number.parseFloat(b.price);
      } else if (sortOrder === "price-high") {
        return Number.parseFloat(b.price) - Number.parseFloat(a.price);
      }

      return 0;
    });

  const handleUnlike = (nftId: string, nftTitle: string) => {
    toast({
      title: "Removed from Liked NFTs",
      description: `"${nftTitle}" has been removed from your liked NFTs.`,
      duration: 3000,
    });
  };

  const handleShare = (nftId: string, nftTitle: string) => {
    const shareUrl = `${window.location.origin}/nft-marketplace/${nftId}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to "${nftTitle}" has been copied to clipboard.`,
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

  const handleNavigateToNFT = (nftId: string) => {
    router.push(`/nft-marketplace/${nftId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Liked NFTs</h1>
        <p className="text-muted-foreground">
          Your favorite music NFTs collection
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search your liked NFTs..."
            className="pl-10"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="album">Albums</SelectItem>
              <SelectItem value="single">Singles</SelectItem>
              <SelectItem value="collectible">Collectibles</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Liked</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredNfts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {filteredNfts.map((nft) => (
            <Card
              key={nft.id}
              className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
              onClick={() => handleNavigateToNFT(nft.id)}
            >
              <div className="relative">
                <img
                  src={nft.imageUrl || "/placeholder.svg"}
                  alt={nft.title}
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary/80 text-primary-foreground">
                    {nft.type}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnlike(nft.id, nft.title);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(nft.id, nft.title);
                    }}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div>
                  <h3 className="text-sm font-bold line-clamp-1">
                    {nft.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{nft.artist}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm font-semibold">{nft.price}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No liked NFTs found</h3>
          <p className="mb-6 text-muted-foreground">
            {filterValue || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Start exploring the NFT marketplace to find NFTs you love"}
          </p>
          <Button onClick={() => router.push("/nft-marketplace")}>
            Explore NFT Marketplace
          </Button>
        </div>
      )}
    </div>
  );
}
