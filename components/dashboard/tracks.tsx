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

export function Tracks({
  filter,
  setFilter,
  sorting,
  setSorting,
  getSortIcon,
}: DashboardProps) {
  const [tracks, setTracks] = useState<PaginatedResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const startItem =
    tracks?.totalCount === 0
      ? 0
      : (tracks?.pageNumber! - 1) * filter.pageSize + 1;
  const endItem = Math.min(
    (tracks?.pageNumber ?? 1) * filter.pageSize,
    tracks?.totalCount || 0
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const queryParams = buildQueryParams(filter, sorting);
        const response = await axios.get<PaginatedResponse>(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }dashboard/tracks?${queryParams.toString()}`
        );

        setTracks(response.data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, sorting]);

  const formatDuration = (duration: string) => {
    const parts = duration.split(":");
    return `${parts[1]}:${parts[2]}`;
  };

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
                  onClick={() => handleSort("title", setSorting)}
                  className="w-[300px]"
                >
                  <div className="flex items-center">
                    Track {getSortIcon(sorting, "title")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[300px]"
                  onClick={() => handleSort("artists.name", setSorting)}
                >
                  <div className="flex items-center">
                    Artists {getSortIcon(sorting, "artists.name")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  onClick={() => handleSort("album.title", setSorting)}
                >
                  <div className="flex items-center">
                    Album {getSortIcon(sorting, "album.title")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  onClick={() => handleSort("playsCount", setSorting)}
                >
                  <div className="flex items-center">
                    Plays {getSortIcon(sorting, "playsCount")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[200px]"
                  onClick={() => handleSort("duration", setSorting)}
                >
                  <div className="flex items-center">
                    Duration {getSortIcon(sorting, "duration")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[300px]"
                  onClick={() => handleSort("releaseDate", setSorting)}
                >
                  <div className="flex items-center">
                    Release Date {getSortIcon(sorting, "releaseDate")}
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks?.data.map((track, index) => (
                <TableRow key={track.id || index}>
                  <TableCell className="font-medium">{track.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <img
                          src={getAvatarUrl(track.imageUrl)}
                          alt={track.title}
                        />
                      </Avatar>
                      <div className="font-medium">{track.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {track.artists.map((x: any) => x.name).join(", ")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {track.album?.title}
                  </TableCell>
                  <TableCell className="font-medium">
                    {track.playsCount}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDuration(track.duration)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(track.releaseDate)}
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
                        <DropdownMenuItem>Edit track</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete track
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
          totalCount={tracks?.totalCount || 0}
          pageNumber={tracks?.pageNumber || 0}
          totalPages={tracks?.totalPages || 0}
          onPageChange={(page) =>
            setFilter((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </CardContent>
    </Card>
  );
}
