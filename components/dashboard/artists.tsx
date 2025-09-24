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
import { DashboardProps } from "../views/admin-dashboard-view";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  buildQueryParams,
  formatDateTime,
  getAvatarUrl,
  handleSort,
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

export function Artists({
  filter,
  setFilter,
  sorting,
  setSorting,
  getSortIcon,
}: DashboardProps) {
  const [artists, setArtists] = useState<PaginatedResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const startItem =
    artists?.totalCount === 0
      ? 0
      : (artists?.pageNumber! - 1) * filter.pageSize + 1;
  const endItem = Math.min(
    (artists?.pageNumber ?? 1) * filter.pageSize,
    artists?.totalCount || 0
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const queryParams = buildQueryParams(filter, sorting);
        const response = await axios.get<PaginatedResponse>(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }dashboard/artists?${queryParams.toString()}`
        );

        setArtists(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
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
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage your platform users</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <TableToolbar filter={filter} setFilter={setFilter} />

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
                  className="w-[300px]"
                >
                  <div className="flex items-center">
                    User {getSortIcon(sorting, "name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[300px]"
                  onClick={() => handleSort("country.name", setSorting)}
                >
                  <div className="flex items-center">
                    Country {getSortIcon(sorting, "country.name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  onClick={() => handleSort("subscribersCount", setSorting)}
                >
                  <div className="flex items-center">
                    Followers {getSortIcon(sorting, "subscribersCount")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  onClick={() => handleSort("albums", setSorting)}
                >
                  <div className="flex items-center">
                    Albums {getSortIcon(sorting, "albums")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  onClick={() => handleSort("tracks", setSorting)}
                >
                  <div className="flex items-center">
                    Tracks {getSortIcon(sorting, "tracks")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[300px]"
                  onClick={() => handleSort("createdDate", setSorting)}
                >
                  <div className="flex items-center">
                    Join Date {getSortIcon(sorting, "createdDate")}
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists?.data.map((artist, index) => (
                <TableRow key={artist.id || index}>
                  <TableCell className="font-medium">{artist.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getAvatarUrl(artist.imageUrl)} />
                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{artist.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {artist.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <CountryFlag code={artist.country.countryCode} />
                      <span>{artist.country.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {artist.subscribersCount}
                  </TableCell>
                  <TableCell className="font-medium">
                    {artist.albums.length}
                  </TableCell>
                  <TableCell className="font-medium">
                    {artist.tracks.length}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(artist.createdDate)}
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
                        <DropdownMenuItem>Edit artist</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete artist
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
          totalCount={artists?.totalCount || 0}
          pageNumber={artists?.pageNumber || 0}
          totalPages={artists?.totalPages || 0}
          onPageChange={(page) =>
            setFilter((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </CardContent>
    </Card>
  );
}
