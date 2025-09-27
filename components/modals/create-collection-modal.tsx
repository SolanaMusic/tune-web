"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Music, User, Disc, AlertCircle, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CollectionType = "album" | "track" | "artist";

interface CreateCollectionModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CollectionFormData) => void;
}

interface CollectionFormData {
  type: CollectionType;
  itemId: string;
  name: string;
  price: number;
  totalSupply: number;
  currency: string;
}

export function CreateCollectionModal({
  id,
  open,
  onOpenChange,
  onSubmit,
}: CreateCollectionModalProps) {
  const [collectionType, setCollectionType] = useState<CollectionType>("album");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [price, setPrice] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [currency, setCurrency] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currencies, setCurrencies] = useState<[]>([]);
  const [albums, setAlbums] = useState<[]>([]);
  const [tracks, setTracks] = useState<[]>([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}currencies`
      );
      setCurrencies(response.data);
      setCurrency(response.data[0].code);
    } catch (error) {
      console.error("Failed to fetch currencies", error);
    }
  };

  const fetchAlbums = async (query: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}albums/by-artists`,
        { params: { title: query, artistIds: id } }
      );
      setAlbums(response.data);
    } catch (error) {
      console.error("Failed to fetch albums", error);
    }
  };

  const fetchTracks = async (query: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}tracks/by-artists`,
        { params: { name: query, artistIds: id } }
      );
      setTracks(response.data);
    } catch (error) {
      console.error("Failed to fetch tracks", error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAlbums("");
      fetchCurrencies();
      fetchTracks("");
    } else {
      setSelectedItemId("");
      setCollectionName("");
      setPrice("");
      setTotalSupply("");
      setErrors({});
      setSearchQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (selectedItemId && collectionType) {
      let selectedItem;

      if (collectionType === "album") {
        selectedItem = albums.find((album) => album.id === selectedItemId);
        if (selectedItem) {
          setCollectionName(`${selectedItem.title} Collection`);
        }
      } else {
        selectedItem = tracks.find((track) => track.id === selectedItemId);
        if (selectedItem) {
          setCollectionName(`${selectedItem.title} Collection`);
        }
      }
    }
  }, [selectedItemId, collectionType]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      if (collectionType === "album") {
        fetchAlbums(debouncedSearchQuery);
      } else if (collectionType === "track") {
        fetchTracks(debouncedSearchQuery);
      }
    } else {
      if (collectionType === "album") {
        fetchAlbums("");
      } else if (collectionType === "track") {
        fetchTracks("");
      }
    }
  }, [debouncedSearchQuery, collectionType]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedItemId) {
      newErrors.selectedItemId = "Please select an item";
    }

    if (!collectionName.trim()) {
      newErrors.collectionName = "Collection name is required";
    }

    if (!price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!totalSupply.trim()) {
      newErrors.totalSupply = "Total supply is required";
    } else if (
      isNaN(Number(totalSupply)) ||
      !Number.isInteger(Number(totalSupply)) ||
      Number(totalSupply) <= 0
    ) {
      newErrors.totalSupply = "Total supply must be a positive integer";
    }

    if (!currency) {
      newErrors.currency = "Currency is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData: CollectionFormData = {
        type: collectionType,
        itemId: selectedItemId,
        name: collectionName,
        price: Number(price),
        totalSupply: Number(totalSupply),
        currency,
      };

      if (onSubmit) {
        onSubmit(formData);
      }

      toast({
        title: "Collection created",
        description: `${collectionName} has been created successfully.`,
      });

      onOpenChange(false);
    }
  };

  const getFilteredItems = () => {
    if (collectionType === "album") {
      return albums;
    } else {
      return tracks;
    }
  };

  const renderItemList = () => {
    const filteredItems = getFilteredItems();

    if (filteredItems.length === 0) {
      return (
        <div className="flex flex-col mt-5 items-center justify-center py-8 text-center text-muted-foreground">
          <AlertCircle className="mb-2 h-10 w-10" />
          <p>No items found. Try a different search term</p>
        </div>
      );
    }

    if (collectionType === "album") {
      return filteredItems.map((album: any) => (
        <Card
          key={album.id}
          className={`mb-2 cursor-pointer transition-colors ${
            selectedItemId === album.id ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => {
            if (selectedItemId === album.id) {
              setSelectedItemId("");
              setCollectionName("");
            } else {
              setSelectedItemId(album.id);
            }
          }}
        >
          <CardContent className="flex items-center p-3">
            <div className="relative mr-3 h-16 w-16 flex-shrink-0">
              <img
                src={
                  `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${album.imageUrl}` ||
                  "/placeholder.svg"
                }
                alt={album.title}
                className="h-full w-full rounded-md object-cover"
              />
              {selectedItemId === album.id && (
                <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="truncate font-medium">{album.title}</h4>
              <p className="text-sm text-muted-foreground">{album.artist}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-1 rounded">
                  {new Date(album.releaseDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>

                <Badge variant="outline" className="text-xs">
                  {album.tracks.length} tracks
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ));
    } else if (collectionType === "track") {
      return filteredItems.map((track: any) => (
        <Card
          key={track.id}
          className={`mb-2 cursor-pointer transition-colors ${
            selectedItemId === track.id ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => {
            if (selectedItemId === track.id) {
              setSelectedItemId("");
              setCollectionName("");
            } else {
              setSelectedItemId(track.id);
            }
          }}
        >
          <CardContent className="flex items-center p-3">
            <div className="relative mr-3 h-16 w-16 flex-shrink-0">
              <img
                src={
                  `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${track.imageUrl}` ||
                  "/placeholder.svg"
                }
                alt={track.title}
                className="h-full w-full rounded-md object-cover"
              />
              {selectedItemId === track.id && (
                <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="truncate font-medium">{track.title}</h4>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {track.album?.title || "Single"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {track.duration}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ));
    }

    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create NFT Collection</DialogTitle>
          <DialogDescription>
            Create a new NFT collection based on an album, track, or artist
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="collection-type">Collection Type</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant={collectionType === "album" ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => {
                  setCollectionType("album");
                  setSelectedItemId("");
                }}
              >
                <Disc className="h-4 w-4" />
                Album
              </Button>
              <Button
                type="button"
                variant={collectionType === "track" ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => {
                  setCollectionType("track");
                  setSelectedItemId("");
                }}
              >
                <Music className="h-4 w-4" />
                Track
              </Button>
              <Button
                type="button"
                variant={collectionType === "artist" ? "default" : "outline"}
                className="flex items-center gap-2"
                onClick={() => {
                  setCollectionType("artist");
                  setSelectedItemId("");
                }}
              >
                <User className="h-4 w-4" />
                Artist
              </Button>
            </div>
          </div>

          {collectionType !== "artist" && (
            <div className="grid gap-2">
              <Label htmlFor="item-search">
                Select{" "}
                {collectionType === "album"
                  ? "an Album"
                  : collectionType === "track"
                  ? "a Track"
                  : "an Artist"}
              </Label>
              <div className="relative">
                <Input
                  id="item-search"
                  placeholder={`Search for ${collectionType}s...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {errors.selectedItemId && (
                <p className="text-sm text-destructive">
                  {errors.selectedItemId}
                </p>
              )}
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-2">{renderItemList()}</div>
              </ScrollArea>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="collection-name">Collection Name</Label>
            <Input
              id="collection-name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Enter collection name"
            />
            {errors.collectionName && (
              <p className="text-sm text-destructive">
                {errors.collectionName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <div className="flex">
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="rounded-r-none"
                />
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-[80px] rounded-l-none border-l-0">
                    <SelectValue placeholder="Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Currencies</SelectLabel>
                      {currencies.length > 0 ? (
                        currencies.map((curr, idx) => (
                          <SelectItem key={idx} value={curr.code}>
                            {curr.code}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          No currencies available
                        </div>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="total-supply">Total Supply</Label>
              <Input
                id="total-supply"
                type="number"
                min="1"
                step="1"
                value={totalSupply}
                onChange={(e) => setTotalSupply(e.target.value)}
                placeholder="10"
              />
              {errors.totalSupply && (
                <p className="text-sm text-destructive">{errors.totalSupply}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Collection</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
