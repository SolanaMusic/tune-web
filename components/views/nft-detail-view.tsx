"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Share2,
  ArrowLeft,
  Music,
  User,
  Clock,
  Calendar,
  Tag,
  BarChart3,
  PaletteIcon,
  AudioLines,
  StarIcon,
  TagIcon,
  HelpCircleIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NFTDetailViewProps {
  id: string;
}

export function NFTDetailView({ id }: NFTDetailViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);

  const nft = {
    id,
    title: `Blinding Lights #${id}`,
    type: "Track",
    artist: "The Weeknd",
    artistId: "a1",
    album: "After Hours",
    albumId: "alb1",
    description:
      "Limited edition NFT of the hit single 'Blinding Lights' by The Weeknd. This NFT grants exclusive access to high-quality audio files, behind-the-scenes content, and a digital collectible artwork.",
    imageUrl: "/placeholder.svg?height=500&width=500",
    price: 0.8,
    currency: "SOL",
    totalSupply: 5000,
    minted: 3245,
    releaseDate: "2019-11-29",
    duration: "3:21",
    owned: false,
    properties: [
      { name: "Audio Quality", value: "24-bit FLAC" },
      { name: "Exclusive Content", value: "Yes" },
      { name: "Artwork", value: "Animated" },
      { name: "Rarity", value: "Rare" },
    ],
    history: [
      {
        event: "Minted",
        date: "2023-01-15",
        price: 0.5,
        from: "Creator",
        to: "User1",
      },
      {
        event: "Transfer",
        date: "2023-03-22",
        price: 0.65,
        from: "User1",
        to: "User2",
      },
      {
        event: "Listed",
        date: "2023-04-10",
        price: 0.8,
        from: "User2",
        to: "-",
      },
    ],
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: `"${nft.title}" has been ${
        isLiked ? "removed from" : "added to"
      } your favorites.`,
      duration: 3000,
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/nft-marketplace/${nft.id}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to "${nft.title}" has been copied to clipboard.`,
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

  const handleMintNFT = () => {
    toast({
      title: "Mint Transaction Initiated",
      description: `Starting the process to mint "${nft.title}" NFT. Please confirm in your wallet.`,
      duration: 5000,
    });
  };

  const handleGoBack = () => {
    router.back();
  };

  const getIconForProperty = (name: string) => {
    const propertyName = name.toLowerCase();

    if (propertyName.includes("artwork")) {
      return <PaletteIcon className="h-5 w-5 text-muted-foreground mt-0.5" />;
    } else if (propertyName.includes("audio")) {
      return <AudioLines className="h-5 w-5 text-muted-foreground mt-0.5" />;
    } else if (propertyName.includes("rarity")) {
      return <StarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />;
    } else if (propertyName.includes("content")) {
      return <TagIcon className="h-5 w-5 text-muted-foreground mt-0.5" />;
    } else {
      return (
        <HelpCircleIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="ghost" className="mb-6" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Marketplace
      </Button>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="relative md:col-span-4">
          <div className="overflow-hidden rounded-lg border">
            <img
              src={nft.imageUrl || "/placeholder.svg"}
              alt={nft.title}
              className="w-full object-cover"
            />
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleLike}
            >
              <Heart
                className={`h-5 w-5 ${
                  isLiked ? "fill-primary text-primary" : ""
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6 md:col-span-8">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/80 text-primary-foreground">
                {nft.type}
              </Badge>
              <Badge variant="outline">#{id.slice(0, 8)}</Badge>
            </div>
            <h1 className="mt-2 text-3xl font-bold">{nft.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">By</span>
              <Button
                variant="link"
                className="p-0 h-auto text-sm font-medium"
                onClick={() => router.push(`/artists/${nft.artistId}`)}
              >
                {nft.artist}
              </Button>
              <span className="text-sm text-muted-foreground">from</span>
              <Button
                variant="link"
                className="p-0 h-auto text-sm font-medium"
                onClick={() => router.push(`/albums/${nft.albumId}`)}
              >
                {nft.album}
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground">{nft.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Price</span>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {nft.price} {nft.currency}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Availability</span>
                </div>
                <div className="mt-1 text-lg font-medium">
                  {nft.minted}/{nft.totalSupply}
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{
                      width: `${(nft.minted / nft.totalSupply) * 100}%`,
                    }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            className="w-full"
            onClick={handleMintNFT}
            disabled={nft.minted >= nft.totalSupply || nft.owned}
          >
            {nft.owned
              ? "Owned"
              : nft.minted >= nft.totalSupply
              ? "Sold Out"
              : "Mint NFT"}
          </Button>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Music className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Track Duration</div>
                        <div className="text-sm text-muted-foreground">
                          {nft.duration}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Creator</div>
                        <div className="text-sm text-muted-foreground">
                          {nft.artist}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Release Date</div>
                        <div className="text-sm text-muted-foreground">
                          {nft.releaseDate}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Minting Ends</div>
                        <div className="text-sm text-muted-foreground">
                          December 31, 2023
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="properties" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                {nft.properties.map((property, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        {getIconForProperty(property.name)}
                        <div>
                          {property.name}
                          <div className="text-sm text-muted-foreground">
                            {property.value}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4">
              <div className="space-y-4">
                {nft.history.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div>
                      <div className="font-medium">{item.event}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.from} {item.to !== "-" ? `→ ${item.to}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div>
                        {item.price} {nft.currency}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
