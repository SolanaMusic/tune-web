"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PurchaseModal } from "@/components/ui/nft-dialog";
import {
  Heart,
  Share2,
  ArrowLeft,
  Music,
  User,
  Star,
  Calendar,
  Tag,
  BarChart3,
  Loader2,
  ClipboardPaste,
  Disc,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSolana } from "@/hooks/use-solana";

export function NFTDetailView({ id }: { id: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [nft, setNft] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { mintNft } = useSolana();

  useEffect(() => {
    fetchNFTDetails();
  }, [id]);

  const fetchNFTDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/${id}`
      );
      setNft(response.data);
    } catch (error) {
      console.error("Error fetching NFT details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: `"${nft?.name}" has been ${
        isLiked ? "removed from" : "added to"
      } your favorites.`,
      duration: 3000,
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/nft-marketplace/nft/${id}`;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: `Link to "${nft?.name}" has been copied to clipboard.`,
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

  const handlePurchase = async () => {
    try {
      const transactionId = await mintNft(nft.id, nft.address, nft.price);
      if (!transactionId) {
        throw new Error("Minting failed");
      }

      await fetchNFTDetails();
    } catch (error) {
      console.error("Error during minting:", error);
      throw error;
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(nft.address);
  };

  if (isLoading) {
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
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 md:grid-cols-12">
        <div className="relative md:col-span-4">
          <div className="overflow-hidden rounded-lg border">
            <img
              src={nft.imageUrl || "/placeholder.svg"}
              alt={nft.name}
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
                {nft.rarity}
              </Badge>

              {(nft.collection.album ||
                nft.collection.track ||
                nft.collection.artist) && (
                <Badge className="bg-primary/80 text-primary-foreground">
                  {nft.collection.album
                    ? `Album`
                    : nft.collection.track
                    ? `Track`
                    : `Artist`}
                </Badge>
              )}
            </div>

            <h1 className="mt-2 text-3xl font-bold">{nft.name}</h1>
            <div className="d-flex flex-column mt-1">
              <span className="text-base text-muted-foreground">
                Collection:
              </span>
              &nbsp;
              <Button
                variant="link"
                className="p-0 h-auto text-base no-underline"
                style={{ textDecoration: "none" }}
                onClick={() =>
                  router.push(
                    `/nft-marketplace/collection/${nft.collection.id}`
                  )
                }
              >
                {nft.collection.name}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleCopyAddress}
            >
              <ClipboardPaste className="h-4 w-4" />#{nft.address}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}token/${nft.address}?cluster=devnet`,
                  "_blank"
                )
              }
            >
              <Disc className="h-4 w-4" />
              View on Solscan
            </Button>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Price</span>
                </div>
                <div className="mt-1 text-2xl font-bold">
                  {nft.price} {nft.currency.code}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Status</span>
                </div>
                <div className="mt-1 text-lg font-medium">
                  {nft.available ? "Available for Mint" : `Minted`}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            className="w-full"
            onClick={() => setIsModalOpen(true)}
            disabled={
              nft.collection.minted >= nft.collection.supply || !nft.available
            }
          >
            {!nft.available || nft.collection.minted >= nft.collection.supply
              ? "Sold Out"
              : "Mint NFT"}
          </Button>

          <PurchaseModal
            name={nft.name}
            image={nft.imageUrl}
            collection={nft.collection.name}
            price={nft.price}
            currency={nft.currency.code}
            address={nft.address}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handlePurchase}
          />

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
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Creators</div>
                        {nft.collection.creators &&
                        nft.collection.creators.length > 0 ? (
                          nft.collection.creators.map((creator, index) => (
                            <span
                              key={creator.id}
                              className="flex items-center"
                            >
                              <Button
                                variant="link"
                                className="p-0 h-auto text-sm font-medium no-underline"
                                style={{ textDecoration: "none" }}
                                onClick={() =>
                                  router.push(`/artists/${creator.id}`)
                                }
                              >
                                {creator.name}
                              </Button>
                              {index < nft.collection.creators.length - 1 && (
                                <span>,&nbsp;</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span>No creators available</span>
                        )}
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
                        <p className="text-sm text-muted-foreground">
                          {new Date(nft.createdDate).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="properties" className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Music className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Audio Quality</div>
                        <p className="text-sm text-muted-foreground">
                          24-bit FLAC
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Rarity</div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <span
                            className={`w-3 h-3 rounded-full ${
                              nft.rarity === "Legendary"
                                ? "bg-yellow-500"
                                : nft.rarity === "Mythic"
                                ? "bg-red-500"
                                : nft.rarity === "Epic"
                                ? "bg-purple-500"
                                : nft.rarity === "Rare"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                          ></span>
                          {nft.rarity}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="pt-4"></TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
