"use client";

import { useEffect, useState, useCallback } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCollectionModal } from "@/components/modals/create-collection-modal";
import {
  PlusCircle,
  Search,
  Disc,
  Music,
  User,
  List,
  Loader2,
} from "lucide-react";

const tabToApiTypeMap: Record<string, string | undefined> = {
  albums: "album",
  tracks: "track",
  artists: "artist",
  all: undefined,
};

export function ArtistNFTCollectionsView({ id }: { id: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [collections, setCollections] = useState<[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCollections = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const type = tabToApiTypeMap[activeTab];
      const queryParams = new URLSearchParams();
      queryParams.append("artistId", id);
      if (type) queryParams.append("type", type);
      if (searchQuery) queryParams.append("name", searchQuery);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}nfts/artist-collections`,
        { params: queryParams }
      );

      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
      setCollections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchCollections = useCallback(
    debounce((searchQuery) => {
      fetchCollections(searchQuery);
    }, 500),
    []
  );

  useEffect(() => {
    fetchCollections(searchQuery);
  }, [id, activeTab]);

  useEffect(() => {
    debouncedFetchCollections(searchQuery);
    return () => {
      debouncedFetchCollections.cancel();
    };
  }, [searchQuery, debouncedFetchCollections]);

  const renderCollectionCards = (collections, type: string) => {
    if (collections.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <p className="mb-2">No {type} collections found.</p>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="h-4 w-4" />
            Create {type} collection
          </Button>
        </div>
      );
    }

    return (
      <div
        className="
        grid 
        grid-cols-1 
        gap-y-6 gap-x-4 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-6
      "
      >
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/nft-marketplace/collection/${collection.id}`}
            className="block"
          >
            <Card className="overflow-hidden cursor-pointer flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={collection.imageUrl || "/placeholder.svg"}
                  alt={collection.name}
                  className="h-48 w-full object-cover"
                />
              </div>
              <CardContent className="p-5 flex flex-col justify-between flex-grow">
                <h3 className="font-semibold text-lg mb-2">
                  {collection.name}
                </h3>

                <div className="mb-4 text-sm text-muted-foreground space-y-1">
                  {collection.album && (
                    <p>
                      Album:{" "}
                      <Link
                        href={`/albums/${collection.album.id}`}
                        className="text-primary underline"
                      >
                        {collection.album.title}
                      </Link>
                    </p>
                  )}
                  {collection.track && (
                    <p>
                      Track:{" "}
                      <Link
                        href={`/tracks/${collection.track.id}`}
                        className="text-primary underline"
                      >
                        {collection.track.title}
                      </Link>
                    </p>
                  )}
                  {collection.artist && (
                    <p>
                      Artist:{" "}
                      <Link
                        href={`/artists/${collection.artist.id}`}
                        className="text-primary underline"
                      >
                        {collection.artist.name}
                      </Link>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Price</p>
                    <p className="font-medium text-base">
                      {collection.price} {collection.currency.code}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground">Supply</p>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 inline-block text-sm"
                    >
                      {collection.minted}/{collection.supply}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">NFT Collections</h2>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create Collection</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Collections</CardTitle>
          <CardDescription>
            Create and manage your NFT collections based on albums, tracks, and
            artists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search collections..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                All
              </TabsTrigger>
              <TabsTrigger value="albums" className="flex items-center gap-2">
                <Disc className="h-4 w-4" />
                Albums
              </TabsTrigger>
              <TabsTrigger value="tracks" className="flex items-center gap-2">
                <Music className="h-4 w-4" />
                Tracks
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Artists
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-[30vh]">
                  <Loader2 className="h-20 w-20 animate-spin text-primary" />
                </div>
              ) : (
                renderCollectionCards(
                  collections,
                  tabToApiTypeMap[activeTab] ?? "all"
                )
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateCollectionModal
        id={id}
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}
