"use client";

import { useEffect, useState, useMemo, FC } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MyWallet } from "@/components/ui/mywallet";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  Music,
  Disc,
  UserCircle,
  Heart,
  Share2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function NFTCollectionsView() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("albums");
  const [data, setData] = useState<any[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [likedNFTs, setLikedNFTs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchNFTData = async (type: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/collection`,
        {
          params: { type },
        }
      );

      setData(response.data);
    } catch (error) {
      console.error("Error fetching NFT data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch NFT data. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchNFTData(activeTab.slice(0, -1));
    setLoading(false);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  }

  const handleNavigateToCollection = (collectionId: string) => {
    router.push(`/nft-marketplace/collection/${collectionId}`);
  };

  const handleLike = (itemType: string, itemId: string, itemName: string) => {
    setLikedNFTs((prev) => ({
      ...prev,
      [`${itemType}-${itemId}`]: !prev[`${itemType}-${itemId}`],
    }));

    const isCurrentlyLiked = likedNFTs[`${itemType}-${itemId}`];
    toast({
      title: isCurrentlyLiked ? "Removed from Favorites" : "Added to Favorites",
      description: `"${itemName}" has been ${
        isCurrentlyLiked ? "removed from" : "added to"
      } your favorites.`,
      duration: 3000,
    });
  };

  const handleShare = (itemId: string, itemName: string) => {
    const shareUrl = `${window.location.origin}/nft-marketplace/collection/${itemId}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to "${itemName}" has been copied to clipboard.`,
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

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(data.length / itemsPerPage);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const renderCardContent = (item: any) => {
    return (
      <Card
        key={item.id}
        className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
        onClick={() => handleNavigateToCollection(item.id)}
      >
        <div className="relative">
          <img
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.name}
            className="aspect-square w-full object-cover"
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleLike(activeTab, item.id, item.name);
              }}
            >
              <Heart
                className={`h-4 w-4 ${
                  likedNFTs[`${activeTab}-${item.id}`]
                    ? "fill-primary text-primary"
                    : ""
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                handleShare(item.id, activeTab);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold line-clamp-1">{item.name}</h3>
          <p className="text-sm text-muted-foreground">
            {item.creators.map((a: any) => (
              <Link
                key={a.id}
                href={`/artists/${a.id}`}
                className="text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                {a.name}
              </Link>
            ))}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold">
                {item.price} {item?.currency?.code || "SOL"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {item.minted}/{item.supply}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">NFT Marketplace</h1>
        <p className="text-muted-foreground">
          Discover, collect, and sell music NFTs
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="relative col-span-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search NFTs, artists, or collections..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="recently-added">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recently-added">Recently Added</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="most-popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Price Range (SOL)
                </label>
                <div className="space-y-3">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={setPriceRange}
                    className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[role=track]]:bg-muted [&_[role=range]]:bg-primary"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{priceRange[0]} SOL</span>
                    <span className="text-sm">{priceRange[1]} SOL</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Status</label>
                <div className="space-y-2">
                  <Button
                    variant={statusFilter === "buy-now" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "buy-now" ? "" : "buy-now"
                      )
                    }
                  >
                    <Badge variant="outline" className="mr-2">
                      {data.length}
                    </Badge>
                    Buy Now
                  </Button>
                  <Button
                    variant={
                      statusFilter === "new-release" ? "default" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "new-release" ? "" : "new-release"
                      )
                    }
                  >
                    <Badge variant="outline" className="mr-2">
                      {data.length}
                    </Badge>
                    New Release
                  </Button>
                  <Button
                    variant={statusFilter === "limited" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "limited" ? "" : "limited"
                      )
                    }
                  >
                    <Badge variant="outline" className="mr-2">
                      {data.length}
                    </Badge>
                    Limited Edition
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Artist Verification
                </label>
                <Button
                  variant={verifiedFilter ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setVerifiedFilter(!verifiedFilter)}
                >
                  <Badge variant="outline" className="mr-2">
                    {data.length}
                  </Badge>
                  Verified Only
                </Button>
              </div>
            </CardContent>
          </Card>
          <MyWallet />
        </div>

        <div className="md:col-span-3">
          <Tabs
            defaultValue="albums"
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="albums" className="flex items-center gap-2">
                <Disc className="h-4 w-4" />
                Albums
              </TabsTrigger>
              <TabsTrigger value="tracks" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Tracks
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Artists
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {getCurrentItems().length === 0 ? (
                <div className="flex flex-col mt-10 items-center justify-center py-12 text-center">
                  <Disc className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
                  <div className="text-muted-foreground max-w-md">
                    <p>There are no NFTs matching your current filters.</p>
                    <p>
                      Try editing your filters or check back later for new
                      releases.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {getCurrentItems().map(renderCardContent)}
                </div>
              )}

              <div className="mt-8 flex justify-center">
                {getTotalPages() > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: getTotalPages() }).map(
                        (_, index) => {
                          const pageNumber = index + 1;

                          if (
                            pageNumber === 1 ||
                            pageNumber === getTotalPages() ||
                            pageNumber === currentPage ||
                            pageNumber === currentPage - 1 ||
                            pageNumber === currentPage + 1
                          ) {
                            return (
                              <PaginationItem key={pageNumber}>
                                <PaginationLink
                                  isActive={pageNumber === currentPage}
                                  onClick={() => setCurrentPage(pageNumber)}
                                >
                                  {pageNumber}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          }

                          if (
                            (pageNumber === 2 && currentPage > 3) ||
                            (pageNumber === getTotalPages() - 1 &&
                              currentPage < getTotalPages() - 2)
                          ) {
                            return (
                              <PaginationItem key={`ellipsis-${pageNumber}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }

                          return null;
                        }
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, getTotalPages())
                            )
                          }
                          className={
                            currentPage === getTotalPages()
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
