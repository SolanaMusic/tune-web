"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Wallet,
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

export function NFTMarketplaceView() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("albums");
  const [priceRange, setPriceRange] = useState([0, 10]);
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [likedNFTs, setLikedNFTs] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const albums = [
    {
      id: "1",
      title: "After Hours",
      artist: "The Weeknd",
      cover: "/placeholder.svg?height=300&width=300",
      price: 2.5,
      currency: "SOL",
      totalSupply: 1000,
      minted: 782,
      releaseDate: "2020-03-20",
    },
    {
      id: "2",
      title: "Starboy",
      artist: "The Weeknd",
      cover: "/placeholder.svg?height=300&width=300",
      price: 1.8,
      currency: "SOL",
      totalSupply: 2000,
      minted: 1856,
      releaseDate: "2016-11-25",
    },
    {
      id: "3",
      title: "Blonde",
      artist: "Frank Ocean",
      cover: "/placeholder.svg?height=300&width=300",
      price: 3.2,
      currency: "SOL",
      totalSupply: 1500,
      minted: 1231,
      releaseDate: "2016-08-20",
    },
    {
      id: "4",
      title: "Astroworld",
      artist: "Travis Scott",
      cover: "/placeholder.svg?height=300&width=300",
      price: 2.0,
      currency: "SOL",
      totalSupply: 1800,
      minted: 1542,
      releaseDate: "2018-08-03",
    },
    {
      id: "5",
      title: "DAMN.",
      artist: "Kendrick Lamar",
      cover: "/placeholder.svg?height=300&width=300",
      price: 1.5,
      currency: "SOL",
      totalSupply: 2500,
      minted: 2134,
      releaseDate: "2017-04-14",
    },
    {
      id: "6",
      title: "Future Nostalgia",
      artist: "Dua Lipa",
      cover: "/placeholder.svg?height=300&width=300",
      price: 1.2,
      currency: "SOL",
      totalSupply: 3000,
      minted: 2456,
      releaseDate: "2020-03-27",
    },
    {
      id: "7",
      title: "Dawn FM",
      artist: "The Weeknd",
      cover: "/placeholder.svg?height=300&width=300",
      price: 2.2,
      currency: "SOL",
      totalSupply: 1200,
      minted: 876,
      releaseDate: "2022-01-07",
    },
    {
      id: "8",
      title: "IGOR",
      artist: "Tyler, The Creator",
      cover: "/placeholder.svg?height=300&width=300",
      price: 1.9,
      currency: "SOL",
      totalSupply: 1800,
      minted: 1234,
      releaseDate: "2019-05-17",
    },
    {
      id: "9",
      title: "Melodrama",
      artist: "Lorde",
      cover: "/placeholder.svg?height=300&width=300",
      price: 1.7,
      currency: "SOL",
      totalSupply: 1600,
      minted: 1100,
      releaseDate: "2017-06-16",
    },
    {
      id: "10",
      title: "Currents",
      artist: "Tame Impala",
      cover: "/placeholder.svg?height=300&width=300",
      price: 1.6,
      currency: "SOL",
      totalSupply: 1700,
      minted: 1300,
      releaseDate: "2015-07-17",
    },
    {
      id: "11",
      title: "Fine Line",
      artist: "Harry Styles",
      cover: "/placeholder.svg?height=300&width=300",
      price: 1.8,
      currency: "SOL",
      totalSupply: 2200,
      minted: 1800,
      releaseDate: "2019-12-13",
    },
    {
      id: "12",
      title: "When We All Fall Asleep",
      artist: "Billie Eilish",
      cover: "/placeholder.svg?height=300&width=300",
      price: 2.1,
      currency: "SOL",
      totalSupply: 2400,
      minted: 2000,
      releaseDate: "2019-03-29",
    },
  ];

  const tracks = [
    {
      id: "t1",
      title: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      albumId: "1",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.8,
      currency: "SOL",
      totalSupply: 5000,
      minted: 3245,
      releaseDate: "2019-11-29",
    },
    {
      id: "t2",
      title: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      albumId: "1",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.7,
      currency: "SOL",
      totalSupply: 5000,
      minted: 2987,
      releaseDate: "2020-03-20",
    },
    {
      id: "t3",
      title: "Heartless",
      artist: "The Weeknd",
      album: "After Hours",
      albumId: "1",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.6,
      currency: "SOL",
      totalSupply: 5000,
      minted: 3112,
      releaseDate: "2019-11-27",
    },
    {
      id: "t4",
      title: "Don't Start Now",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      albumId: "6",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.5,
      currency: "SOL",
      totalSupply: 6000,
      minted: 4532,
      releaseDate: "2019-10-31",
    },
    {
      id: "t5",
      title: "HUMBLE.",
      artist: "Kendrick Lamar",
      album: "DAMN.",
      albumId: "5",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.9,
      currency: "SOL",
      totalSupply: 4000,
      minted: 3542,
      releaseDate: "2017-03-30",
    },
    {
      id: "t6",
      title: "Sicko Mode",
      artist: "Travis Scott",
      album: "Astroworld",
      albumId: "4",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.75,
      currency: "SOL",
      totalSupply: 4500,
      minted: 3896,
      releaseDate: "2018-08-03",
    },
    {
      id: "t7",
      title: "Bad Guy",
      artist: "Billie Eilish",
      album: "When We All Fall Asleep",
      albumId: "12",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.85,
      currency: "SOL",
      totalSupply: 5500,
      minted: 4200,
      releaseDate: "2019-03-29",
    },
    {
      id: "t8",
      title: "Watermelon Sugar",
      artist: "Harry Styles",
      album: "Fine Line",
      albumId: "11",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.65,
      currency: "SOL",
      totalSupply: 4800,
      minted: 3700,
      releaseDate: "2019-12-13",
    },
    {
      id: "t9",
      title: "The Less I Know The Better",
      artist: "Tame Impala",
      album: "Currents",
      albumId: "10",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.7,
      currency: "SOL",
      totalSupply: 4200,
      minted: 3100,
      releaseDate: "2015-07-17",
    },
    {
      id: "t10",
      title: "Green Light",
      artist: "Lorde",
      album: "Melodrama",
      albumId: "9",
      cover: "/placeholder.svg?height=300&width=300",
      price: 0.6,
      currency: "SOL",
      totalSupply: 3800,
      minted: 2900,
      releaseDate: "2017-06-16",
    },
  ];

  const artists = [
    {
      id: "a1",
      name: "The Weeknd",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "65.3M",
      price: 5.0,
      currency: "SOL",
      totalSupply: 500,
      minted: 472,
    },
    {
      id: "a2",
      name: "Dua Lipa",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "42.8M",
      price: 4.2,
      currency: "SOL",
      totalSupply: 700,
      minted: 586,
    },
    {
      id: "a3",
      name: "Kendrick Lamar",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "38.5M",
      price: 6.5,
      currency: "SOL",
      totalSupply: 400,
      minted: 389,
    },
    {
      id: "a4",
      name: "Travis Scott",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "47.2M",
      price: 4.8,
      currency: "SOL",
      totalSupply: 600,
      minted: 534,
    },
    {
      id: "a5",
      name: "Frank Ocean",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "35.6M",
      price: 7.2,
      currency: "SOL",
      totalSupply: 300,
      minted: 298,
    },
    {
      id: "a6",
      name: "Tyler, The Creator",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "32.9M",
      price: 4.5,
      currency: "SOL",
      totalSupply: 550,
      minted: 489,
    },
    {
      id: "a7",
      name: "Billie Eilish",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "61.2M",
      price: 5.5,
      currency: "SOL",
      totalSupply: 450,
      minted: 412,
    },
    {
      id: "a8",
      name: "Harry Styles",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "58.7M",
      price: 5.2,
      currency: "SOL",
      totalSupply: 480,
      minted: 435,
    },
    {
      id: "a9",
      name: "Tame Impala",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "28.4M",
      price: 4.0,
      currency: "SOL",
      totalSupply: 350,
      minted: 310,
    },
    {
      id: "a10",
      name: "Lorde",
      avatar: "/placeholder.svg?height=300&width=300",
      followers: "24.6M",
      price: 3.8,
      currency: "SOL",
      totalSupply: 320,
      minted: 275,
    },
  ];

  const handleMintNFT = (
    itemType: string,
    itemId: string,
    itemName: string
  ) => {
    toast({
      title: "Mint Transaction Initiated",
      description: `Starting the process to mint "${itemName}" NFT. Please confirm in your wallet.`,
      duration: 5000,
    });
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

  const handleShare = (itemType: string, itemId: string, itemName: string) => {
    const shareUrl = `${window.location.origin}/nft-marketplace/${itemId}`;

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

  const handleNavigateToNFT = (itemType: string, itemId: string) => {
    router.push(`/nft-marketplace/${itemId}`);
  };

  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    if (activeTab === "albums") {
      return albums.slice(startIndex, endIndex);
    } else if (activeTab === "tracks") {
      return tracks.slice(startIndex, endIndex);
    } else {
      return artists.slice(startIndex, endIndex);
    }
  };

  const getTotalPages = () => {
    let totalItems = 0;
    if (activeTab === "albums") {
      totalItems = albums.length;
    } else if (activeTab === "tracks") {
      totalItems = tracks.length;
    } else {
      totalItems = artists.length;
    }
    return Math.ceil(totalItems / itemsPerPage);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
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
        {/* Filters Sidebar */}
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
                      123
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
                      58
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
                      42
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
                    205
                  </Badge>
                  Verified Only
                </Button>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Balance</div>
                    <div className="text-2xl font-bold">12.8 SOL</div>
                  </div>
                </div>
                <div className="rounded-md bg-muted p-3">
                  <div className="text-xs text-muted-foreground">
                    Current Address
                  </div>
                  <div className="text-sm font-mono truncate">8xFgh...3kPz</div>
                </div>
                <Button className="w-full">View My NFTs</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
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

            <TabsContent value="albums" className="mt-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {getCurrentItems().map((album: any) => (
                  <Card
                    key={album.id}
                    className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                    onClick={() => handleNavigateToNFT("album", album.id)}
                  >
                    <div className="relative">
                      <img
                        src={album.cover || "/placeholder.svg"}
                        alt={album.title}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike("album", album.id, album.title);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              likedNFTs[`album-${album.id}`]
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
                            handleShare("album", album.id, album.title);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold line-clamp-1">{album.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {album.artist}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-semibold">
                            {album.price} {album.currency}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {album.minted}/{album.totalSupply}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMintNFT("album", album.id, album.title);
                        }}
                      >
                        {album.minted >= album.totalSupply
                          ? "Sold Out"
                          : "Mint NFT"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tracks" className="mt-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {getCurrentItems().map((track: any) => (
                  <Card
                    key={track.id}
                    className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                    onClick={() => handleNavigateToNFT("track", track.id)}
                  >
                    <div className="relative">
                      <img
                        src={track.cover || "/placeholder.svg"}
                        alt={track.title}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike("track", track.id, track.title);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              likedNFTs[`track-${track.id}`]
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
                            handleShare("track", track.id, track.title);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold line-clamp-1">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {track.artist}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From: {track.album}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-semibold">
                            {track.price} {track.currency}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {track.minted}/{track.totalSupply}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMintNFT("track", track.id, track.title);
                        }}
                      >
                        {track.minted >= track.totalSupply
                          ? "Sold Out"
                          : "Mint NFT"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="artists" className="mt-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {getCurrentItems().map((artist: any) => (
                  <Card
                    key={artist.id}
                    className="overflow-hidden transition-all hover:shadow-md cursor-pointer"
                    onClick={() => handleNavigateToNFT("artist", artist.id)}
                  >
                    <div className="relative">
                      <img
                        src={artist.avatar || "/placeholder.svg"}
                        alt={artist.name}
                        className="aspect-square w-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike("artist", artist.id, artist.name);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              likedNFTs[`artist-${artist.id}`]
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
                            handleShare("artist", artist.id, artist.name);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold line-clamp-1">{artist.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {artist.followers} followers
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-semibold">
                            {artist.price} {artist.currency}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {artist.minted}/{artist.totalSupply}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t p-4">
                      <Button
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMintNFT("artist", artist.id, artist.name);
                        }}
                      >
                        {artist.minted >= artist.totalSupply
                          ? "Sold Out"
                          : "Mint NFT"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
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
        </div>
      </div>
    </div>
  );
}
