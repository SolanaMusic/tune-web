"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MoreHorizontalIcon, SearchIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { PaginatedResponse } from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardProps, NftsFilter } from "../views/admin-dashboard-view";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  buildQueryParams,
  formatDateTime,
  getAvatarUrl,
  handleSort,
  Sorting,
} from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { TableToolbar } from "./tables/table-toolbar";
import { TableFooter } from "./tables/table-footer";
import { CountryFlag } from "../ui/country-flag";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

interface NftsProps {
  filter: NftsFilter;
  setFilter: React.Dispatch<React.SetStateAction<NftsFilter>>;
  sorting: Sorting;
  setSorting: React.Dispatch<React.SetStateAction<Sorting>>;
  getSortIcon: (sorting: Sorting, column: string) => React.ReactNode;
}

export function Nfts({
  filter,
  setFilter,
  sorting,
  setSorting,
  getSortIcon,
}: NftsProps) {
  const [nfts, setNfts] = useState<PaginatedResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const startItem =
    nfts?.totalCount === 0 ? 0 : (nfts?.pageNumber! - 1) * filter.pageSize + 1;
  const endItem = Math.min(
    (nfts?.pageNumber ?? 1) * filter.pageSize,
    nfts?.totalCount || 0
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const fixedFilter = {
          ...filter,
          type: filter.type === "All" ? "" : filter.type,
        };

        const queryParams = buildQueryParams(fixedFilter, sorting);
        const response = await axios.get<PaginatedResponse>(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }dashboard/nfts?${queryParams.toString()}`
        );

        setNfts(response.data);
      } catch (error) {
        console.error("Error fetching nfts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, sorting]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>NFT Management</CardTitle>
        <CardDescription>Manage your platform NFTs</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <TableToolbar filter={filter} setFilter={setFilter}>
          <Select
            value={filter.type}
            onValueChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                type: value as "Album" | "Artist" | "Track" | "All",
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Album">Album</SelectItem>
              <SelectItem value="Artist">Artist</SelectItem>
              <SelectItem value="Track">Track</SelectItem>
            </SelectContent>
          </Select>
        </TableToolbar>

        <div
          className="rounded-md border"
          ref={tableContainerRef}
          style={{ height: "400px", overflow: "auto" }}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[100px]"
                  onClick={() => handleSort("id", setSorting)}
                >
                  <div className="flex items-center">
                    ID {getSortIcon(sorting, "id")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("name", setSorting)}
                  className="w-[350px]"
                >
                  <div className="flex items-center">
                    NFT {getSortIcon(sorting, "name")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("minted", setSorting)}
                  className="w-[150px]"
                >
                  <div className="flex items-center">
                    Mint {getSortIcon(sorting, "minted")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("price", setSorting)}
                  className="w-[200px]"
                >
                  <div className="flex items-center">
                    Price {getSortIcon(sorting, "price")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[350px]"
                  onClick={() => handleSort("creator.name", setSorting)}
                >
                  <div className="flex items-center">
                    Creator {getSortIcon(sorting, "creator.name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[250px]"
                  onClick={() => handleSort("associationType", setSorting)}
                >
                  <div className="flex items-center">
                    Type {getSortIcon(sorting, "associationType")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[250px]"
                  onClick={() => handleSort("createdDate", setSorting)}
                >
                  <div className="flex items-center">
                    Date Added {getSortIcon(sorting, "createdDate")}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nfts?.data.map((nft, index) => (
                <TableRow key={nft.id || index}>
                  <TableCell className="font-medium">{nft.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={getAvatarUrl(nft.imageUrl)}
                          alt={nft.name}
                        />
                        <AvatarFallback>{nft.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {nft.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {nft.minted}/{nft.supply}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {nft.price} {nft.currency.code}
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <CountryFlag code={nft.creators[0].country.countryCode} />
                      <span>{nft.creators[0].name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {nft.associationType}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(nft.createdDate)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit NFT</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete NFT
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <TableFooter
          startItem={startItem}
          endItem={endItem}
          totalCount={nfts?.totalCount || 0}
          pageNumber={nfts?.pageNumber || 0}
          totalPages={nfts?.totalPages || 0}
          onPageChange={(page) =>
            setFilter((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </CardContent>
    </Card>
  );
}
