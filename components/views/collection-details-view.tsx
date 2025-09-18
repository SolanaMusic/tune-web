"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSolana } from "@/hooks/use-solana";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ArrowLeft,
  Heart,
  Share2,
  BarChart3,
  Tag,
  Loader2,
  Disc,
  CheckCircle2,
  Timer,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { MyWallet } from "../ui/mywallet";
import { PurchaseModal } from "@/components/modals/nft-modal";
import { useUserStore } from "@/stores/UserStore";
import Link from "next/link";

export function CollectionDetailView({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useUserStore();
  const { mintNft } = useSolana();
  const [collection, setCollection] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [priceRange, setPriceRange] = useState([0, 10]);
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCollectionData();
  }, [id]);

  const fetchCollectionData = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/collections/${id}`,
        {
          params: user?.id ? { userId: user.id } : {},
        }
      );
      setCollection(response.data);
    } catch (error) {
      console.error("Failed to fetch collection data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLikeRequest = async (
    id: string,
    type: "nft" | "collection",
    liked: boolean
  ) => {
    if (!liked) {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/liked`, {
        userId: user?.id,
        ...(type === "nft" ? { nftId: id } : { collectionId: id }),
      });
    } else {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/liked/${id}?type=${type}`
      );
    }
  };

  const handleLike = async (id: string, type: "nft" | "collection") => {
    if (!user) return;

    try {
      if (type === "collection") {
        const isLiked = collection.isLiked;
        setCollection((prev: any) => ({ ...prev, isLiked: !isLiked }));

        await toggleLikeRequest(id, "collection", isLiked);
      } else {
        setCollection((prev: any) => ({
          ...prev,
          nfts: prev.nfts.map((nft: any) =>
            nft.id === id ? { ...nft, isLiked: !nft.isLiked } : nft
          ),
        }));

        const nft = collection.nfts.find((nft: any) => nft.id === id);
        if (!nft) return;

        await toggleLikeRequest(id, "nft", nft.isLiked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handlePurchase = async () => {
    try {
      const transactionId = await mintNft(
        selectedNFT.id,
        selectedNFT.address,
        selectedNFT.price
      );
      if (!transactionId) {
        throw new Error("Minting failed");
      }

      await fetchCollectionData();
    } catch (error) {
      console.error("Error during minting:", error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNFT(null);
  };

  const getFilteredNFTs = () => {
    if (!collection) return [];
    let filtered = [...collection.nfts];

    if (statusFilter === "available") {
      filtered = filtered.filter((nft) => nft.available);
    } else if (statusFilter === "minted") {
      filtered = filtered.filter((nft) => !nft.available);
    }

    if (!statusFilter) {
      filtered = filtered.sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        return 0;
      });
    }

    filtered = filtered.filter(
      (nft) => nft.price >= priceRange[0] && nft.price <= priceRange[1]
    );

    return filtered;
  };

  const filteredNFTs = getFilteredNFTs();

  const getCurrentFilteredNFTs = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredNFTs.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(collection.nfts.length / itemsPerPage);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[75vh]">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 text-lg"
        onClick={() => router.push("/nft-marketplace")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Collections
      </Button>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 flex justify-center items-start">
          <img
            src={collection.imageUrl}
            alt={collection.name}
            className="w-3/4 md:w-4/5 rounded-lg object-cover aspect-square shadow-md"
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold mb-1">{collection.name}</h1>

            <Badge className="bg-primary/80 text-primary-foreground">
              {collection.associationType}
            </Badge>
          </div>

          <div className="mb-6 text-muted-foreground">
            A collection of unique NFTs from{" "}
            {collection.creators && collection.creators.length > 0 ? (
              collection.creators.map((creator, index) => (
                <span key={creator.id}>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-base no-underline"
                    style={{ textDecoration: "none" }}
                    onClick={() => router.push(`/artists/${creator.id}`)}
                  >
                    {creator.name}
                  </Button>
                  {index < collection.creators.length - 1 && ", "}
                </span>
              ))
            ) : (
              <span>No creators available</span>
            )}
            {(collection.album || collection.track) && (
              <div className="mt-1">
                {collection.album ? (
                  <>
                    <span>Album: </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-base no-underline"
                      style={{ textDecoration: "none" }}
                      onClick={() =>
                        router.push(`/albums/${collection.album.id}`)
                      }
                    >
                      {collection.album.title}
                    </Button>
                  </>
                ) : (
                  <>
                    <span>Track: </span>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm font-medium no-underline"
                      style={{ textDecoration: "none" }}
                      onClick={() =>
                        router.push(`/tracks/${collection.track.id}`)
                      }
                    >
                      {collection.track.title}
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Floor Price</span>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {collection.price} {collection?.currency?.code || "SOL"}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Minted</span>
                </div>
                <div className="mt-1 text-lg font-medium">
                  {collection.minted}/{collection.supply}
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${
                        (collection.minted / collection.supply) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Button
                variant={collection.isLiked ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => handleLike(collection.id, "collection")}
              >
                <Heart />{" "}
                {collection.isLiked ? "Added To Watchlist" : "Add To Watchlist"}
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share Collection
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="relative col-span-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search NFTs in this collection..."
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
              <SelectItem value="rarity">Rarity</SelectItem>
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
                    variant={
                      statusFilter === "available" ? "default" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "available" ? "" : "available"
                      )
                    }
                  >
                    <Badge variant="outline" className="mr-2">
                      {collection.nfts.filter((nft) => nft.available).length}
                    </Badge>
                    Available
                  </Button>
                  <Button
                    variant={statusFilter === "minted" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() =>
                      setStatusFilter(statusFilter === "minted" ? "" : "minted")
                    }
                  >
                    <Badge variant="outline" className="mr-2">
                      {collection.nfts.filter((nft) => !nft.available).length}
                    </Badge>
                    Minted
                  </Button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Rarity</label>
                <div className="space-y-2">
                  {["Common", "Rare", "Epic", "Mythic", "Legendary"].map(
                    (rarity) => (
                      <Button
                        key={rarity}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Badge variant="outline" className="mr-2">
                          {
                            collection.nfts.filter(
                              (nft) => nft.rarity === rarity
                            ).length
                          }
                        </Badge>
                        {rarity}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          <MyWallet />
        </div>

        {selectedNFT && isModalOpen && (
          <PurchaseModal
            name={selectedNFT.name}
            image={selectedNFT.imageUrl}
            collection={collection.name}
            price={selectedNFT.price}
            currency={selectedNFT.currency.code}
            address={selectedNFT.address}
            isOpen={!!selectedNFT}
            onClose={handleCloseModal}
            onConfirm={handlePurchase}
          />
        )}

        <div className="md:col-span-3">
          <h2 className="text-2xl font-bold mb-6">NFTs in this Collection</h2>

          {getCurrentFilteredNFTs().length > 0 ? (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {getCurrentFilteredNFTs().map((nft) => (
                <Card
                  key={nft.id}
                  className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                  onClick={() => router.push(`/nft-marketplace/nft/${nft.id}`)}
                >
                  <div className="relative">
                    <img
                      src={nft.imageUrl || "/placeholder.svg"}
                      alt={nft.name}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Badge
                        className={`${
                          nft.available ? "bg-green-500" : "bg-blue-500"
                        } text-white hover:${
                          nft.available ? "bg-green-600" : "bg-blue-600"
                        } transition-colors duration-300`}
                      >
                        <div className="flex items-center gap-1">
                          {nft.available ? (
                            <>
                              <CheckCircle2 className="h-4 w-4" /> Available
                            </>
                          ) : (
                            <>
                              <Timer className="h-4 w-4" /> Minted
                            </>
                          )}
                        </div>
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(nft.id, "nft");
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            nft.isLiked ? "fill-primary text-primary" : ""
                          }`}
                        />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold line-clamp-1">{nft.name}</h3>
                    {collection.album && (
                      <p className="text-xs text-muted-foreground">
                        From:{" "}
                        <Link
                          href={`/albums/${collection.album.id}`}
                          className="hover:underline"
                        >
                          {collection.album.title}
                        </Link>
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold">
                          {nft.price} {nft.currency.code}
                        </span>
                      </div>
                      <div className="text-xs">
                        <Badge
                          variant="outline"
                          className={`font-normal ${
                            nft.rarity === "Legendary"
                              ? "border-yellow-500 text-yellow-500"
                              : nft.rarity === "Mythic"
                              ? "border-red-500 text-red-500"
                              : nft.rarity === "Epic"
                              ? "border-purple-500 text-purple-500"
                              : nft.rarity === "Rare"
                              ? "border-green-500 text-green-500"
                              : "border-blue-500 text-blue-500"
                          }`}
                        >
                          {nft.rarity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4">
                    <Button
                      className={`w-full ${
                        !nft.available ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (nft.available) {
                          setSelectedNFT(nft);
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      {!nft.available ? "Minted" : "Mint NFT"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Disc className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
              <p className="text-muted-foreground max-w-md">
                There are no NFTs matching your current filters. Try adjusting
                your filters or check back later for new releases.
              </p>
            </div>
          )}

          {filteredNFTs.length > itemsPerPage && (
            <div className="mt-8 flex justify-center">
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

                  {Array.from({ length: getTotalPages() }).map((_, index) => {
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
                  })}

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
