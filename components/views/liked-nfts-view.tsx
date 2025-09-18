"use client";

import { useEffect, useState } from "react";
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
import { useUserStore } from "@/stores/UserStore";
import axios from "axios";

export function LikedNFTsView() {
  const router = useRouter();
  const { user } = useUserStore();
  const [liked, setLiked] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>();
  const [filterValue, setFilterValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("recent");

  useEffect(() => {
    if (!user?.id) return;

    const fetchLiked = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/liked/${user?.id}`
        );
        setLiked(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLiked();
  }, [user]);

  const filteredItems = liked
    .filter((item) => {
      if (!filterValue) return true;
      const searchLower = filterValue.toLowerCase();
      const name = item.nft?.name || item.collection?.name || "";
      return name.toLowerCase().includes(searchLower);
    })
    .filter((item) => {
      if (typeFilter === "all") return true;
      const type = item.nft ? "nft" : item.collection ? "collection" : "";
      return type.toLowerCase() === typeFilter.toLowerCase();
    })
    .sort((a, b) => {
      const priceA = a.nft?.price ?? a.collection?.price ?? 0;
      const priceB = b.nft?.price ?? b.collection?.price ?? 0;

      const dateA = new Date(a.createdDate ?? a.createdDate).getTime();
      const dateB = new Date(b.createdDate ?? b.createdDate).getTime();

      switch (sortOrder) {
        case "price-low":
          return priceA - priceB;
        case "price-high":
          return priceB - priceA;
        case "recent":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        default:
          return 0;
      }
    });

  const handleClick = (item: any) => {
    if (item.nft) router.push(`/nft-marketplace/nft/${item.nft.id}`);
    else if (item.collection)
      router.push(`/nft-marketplace/collection/${item.collection.id}`);
  };

  const deleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/liked/${itemToDelete.id}`
      );

      setLiked((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Liked NFTs</h1>
        <p className="text-muted-foreground">
          Your favorite music NFTs and collections
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
              <SelectItem value="nft">NFTs</SelectItem>
              <SelectItem value="collection">Collections</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Liked</SelectItem>
              <SelectItem value="oldest">Oldest Liked</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {filteredItems.map((item) => {
              const data = item.nft || item.collection;
              const type = item.nft ? "NFT" : "Collection";

              return (
                <Card
                  key={item.id}
                  className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                  onClick={() => handleClick(item)}
                >
                  <div className="relative">
                    <img
                      src={data.imageUrl || "/placeholder.svg"}
                      alt={data.name}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute top-2 left-2 right-2 flex items-start gap-1">
                      {item.nft && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            item.nft.rarity === "Legendary"
                              ? "border-yellow-500 text-yellow-500"
                              : item.nft.rarity === "Mythic"
                              ? "border-red-500 text-red-500"
                              : item.nft.rarity === "Epic"
                              ? "border-purple-500 text-purple-500"
                              : item.nft.rarity === "Rare"
                              ? "border-green-500 text-green-500"
                              : "border-blue-500 text-blue-500"
                          }`}
                        >
                          {item.nft.rarity}
                        </Badge>
                      )}
                      <div className="ml-auto">
                        <Badge className="bg-primary/80 text-primary-foreground">
                          {type}
                        </Badge>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setItemToDelete(item);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Heart className="h-4 w-4 fill-primary text-primary" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div>
                      <h3 className="text-sm font-bold line-clamp-1">
                        {data.name}
                      </h3>
                      {data.artist && (
                        <p className="text-sm text-muted-foreground">
                          {data.artist}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-semibold">
                            {item.collection
                              ? item.collection.price
                              : item.nft?.price ?? 0}{" "}
                            {item.collection
                              ? item.collection.currency?.code
                              : item.nft?.currency?.code}{" "}
                            {item.collection ? "Floor" : ""}
                          </span>
                        </div>
                        {item.collection && (
                          <div className="text-xs text-muted-foreground">
                            {item.collection.minted}/{item.collection.supply}{" "}
                            minted
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent className="w-[90vw] rounded">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Liked NFT</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setIsDeleteDialogOpen(false);
                    setItemToDelete(null);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteItem}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center mt-16 md:mt-28">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-medium">No liked items found</h3>
          <p className="mb-6 text-muted-foreground">
            {filterValue || typeFilter !== "all"
              ? "Try adjusting your filters"
              : "Start exploring the NFT marketplace to find NFTs or collections you love"}
          </p>
          <Button onClick={() => router.push("/nft-marketplace")}>
            Explore NFT Marketplace
          </Button>
        </div>
      )}
    </div>
  );
}
