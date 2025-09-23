"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DownloadIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";
import { Reports } from "../dashboard/reports";
import { Overview } from "../dashboard/overview";
import { ArtistApplications } from "../dashboard/artist-applications";
import axios from "axios";

interface DashboardFilter {
  query: string;
  timeFilter: "Today" | "Week" | "Month" | "Year" | "AllTime";
  pageNumber: number;
  totalPages: number;
  pageSize: number;
}

export interface DashboardSorting {
  sortColumn: string;
  sortDirection: "Asc" | "Desc";
}

export interface ArtistApplicationsFilter extends DashboardFilter {
  status: "Pending" | "Approved" | "Rejected" | "All";
}

export const fetchPendingApplications = async () => {
  try {
    var response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}dashboard/active-applications`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching active applications:", error);
  }
};

export function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeApplications, setActiveApplications] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [applicationsSorting, setApplicationsSorting] =
    useState<DashboardSorting>({ sortColumn: "", sortDirection: "Asc" });
  const [applicationsFilter, setApplicationsFilter] =
    useState<ArtistApplicationsFilter>({
      query: "",
      timeFilter: "AllTime",
      pageNumber: 1,
      totalPages: 1,
      pageSize: 10,
      status: "All",
    });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPendingApplications();
      setActiveApplications(response);
    };

    fetchData();
  }, []);

  const users = Array.from({ length: 100 }, (_, i) => ({
    id: `u${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    plan: i % 3 === 0 ? "Premium" : i % 3 === 1 ? "Basic" : "Family",
    status:
      i % 4 === 0
        ? "Active"
        : i % 4 === 1
        ? "Inactive"
        : i % 4 === 2
        ? "Pending"
        : "Suspended",
    joinDate: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toLocaleDateString(),
  }));

  const songs = Array.from({ length: 100 }, (_, i) => ({
    id: `s${i + 1}`,
    title: `Song ${i + 1}`,
    artist: `Artist ${Math.floor(i / 10) + 1}`,
    album: `Album ${Math.floor(i / 5) + 1}`,
    plays: Math.floor(Math.random() * 1000000),
    duration: `${Math.floor(Math.random() * 4) + 2}:${Math.floor(
      Math.random() * 60
    )
      .toString()
      .padStart(2, "0")}`,
    releaseDate: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toLocaleDateString(),
  }));

  const nfts = Array.from({ length: 100 }, (_, i) => ({
    id: `nft${i + 1}`,
    title: `NFT ${i + 1}`,
    artist: `Artist ${Math.floor(i / 8) + 1}`,
    type: i % 3 === 0 ? "Album" : i % 3 === 1 ? "Single" : "Collectible",
    price: (Math.random() * 10).toFixed(2),
    currency: "SOL",
    minted: Math.floor(Math.random() * 1000),
    totalSupply: 1000,
    createdDate: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toLocaleDateString(),
  }));

  const artists = Array.from({ length: 100 }, (_, i) => ({
    id: `a${i + 1}`,
    name: `Artist ${i + 1}`,
    followers: Math.floor(Math.random() * 10000000),
    tracks: Math.floor(Math.random() * 100) + 1,
    albums: Math.floor(Math.random() * 10) + 1,
    revenue: Math.floor(Math.random() * 1000000),
    verified: i % 3 === 0,
    joinDate: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000)
    ).toLocaleDateString(),
  }));

  const filterData = (data: any[]) => {
    return data
      .filter((item) => {
        if (filterValue) {
          const searchLower = filterValue.toLowerCase();
          return Object.values(item).some(
            (val) =>
              val !== undefined &&
              val !== null &&
              String(val).toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter((item) => {
        if (statusFilter !== "all" && item.status) {
          return item.status.toLowerCase() === statusFilter.toLowerCase();
        }
        return true;
      })
      .filter((item) => {
        if (dateFilter !== "all") {
          const dateStr = item.joinDate || item.releaseDate || item.createdDate;
          if (!dateStr) return true;

          try {
            const itemDate = new Date(dateStr);
            const now = new Date();

            switch (dateFilter) {
              case "today":
                return itemDate.toDateString() === now.toDateString();
              case "week":
                const weekAgo = new Date();
                weekAgo.setDate(now.getDate() - 7);
                return itemDate >= weekAgo;
              case "month":
                const monthAgo = new Date();
                monthAgo.setMonth(now.getMonth() - 1);
                return itemDate >= monthAgo;
              case "year":
                const yearAgo = new Date();
                yearAgo.setFullYear(now.getFullYear() - 1);
                return itemDate >= yearAgo;
              default:
                return true;
            }
          } catch (e) {
            return true;
          }
        }
        return true;
      });
  };

  const sortData = (data: any[]) => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === undefined || aValue === null)
        return sortDirection === "asc" ? -1 : 1;
      if (bValue === undefined || bValue === null)
        return sortDirection === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const handleSort = (
    column: string,
    sorting: DashboardSorting,
    setSorting: React.Dispatch<React.SetStateAction<DashboardSorting>>
  ) => {
    setSorting((prev) => {
      if (prev.sortColumn === column) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === "Asc" ? "Desc" : "Asc",
        };
      } else {
        return {
          sortColumn: column,
          sortDirection: "Asc",
        };
      }
    });
  };

  const getSortIcon = (sorting: DashboardSorting, column: string) => {
    if (sorting.sortColumn !== column) {
      return <ArrowUpDownIcon className="ml-2 h-4 w-4" />;
    }
    return sorting.sortDirection === "Asc" ? (
      <ArrowUpIcon className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-2 h-4 w-4" />
    );
  };

  const getPaginatedData = (data: any[]) => {
    const filteredData = filterData(data);
    const sortedData = sortData(filteredData);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return {
      data: sortedData.slice(startIndex, endIndex),
      totalItems: sortedData.length,
      totalPages: Math.ceil(sortedData.length / itemsPerPage),
    };
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "users":
        return getPaginatedData(users);
      case "artists":
        return getPaginatedData(artists);
      case "songs":
        return getPaginatedData(songs);
      case "nfts":
        return getPaginatedData(nfts);
      default:
        return { data: [], totalItems: 0, totalPages: 0 };
    }
  };

  const { data, totalItems, totalPages } = getCurrentData();

  useEffect(() => {
    setCurrentPage(1);
    setSortColumn(null);
    setSortDirection("asc");
    setFilterValue("");
    setStatusFilter("all");
    setDateFilter("all");
  }, [activeTab]);

  const formatNumber = (value: any) => {
    if (value === undefined || value === null) return "N/A";
    if (typeof value === "number") return value.toLocaleString();
    return value;
  };

  const renderTable = () => {
    switch (activeTab) {
      case "users":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">ID</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Name</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Email</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">
                    <span>Plan</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Status</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Date</div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user, index) => (
                <TableRow key={user.id || index}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.plan}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        user.status === "Active"
                          ? "bg-green-500/20 text-green-500"
                          : user.status === "Inactive"
                          ? "bg-amber-500/20 text-amber-500"
                          : user.status === "Pending"
                          ? "bg-blue-500/20 text-blue-500"
                          : "bg-red-500/20 text-red-500"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
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
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "songs":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">ID</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Title</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Artist</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Album</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Plays</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Duration</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Release Date</div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((song, index) => (
                <TableRow key={song.id || index}>
                  <TableCell className="font-medium">{song.id}</TableCell>
                  <TableCell>{song.title}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                  <TableCell>{song.album}</TableCell>
                  <TableCell>{formatNumber(song.plays)}</TableCell>
                  <TableCell>{song.duration}</TableCell>
                  <TableCell>{song.releaseDate}</TableCell>
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
                        <DropdownMenuItem>Edit song</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete song
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "nfts":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">ID</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Title</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Artist</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Type</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Price</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Minted</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Created Date</div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((nft, index) => (
                <TableRow key={nft.id || index}>
                  <TableCell className="font-medium">{nft.id}</TableCell>
                  <TableCell>{nft.title}</TableCell>
                  <TableCell>{nft.artist}</TableCell>
                  <TableCell>{nft.type}</TableCell>
                  <TableCell>
                    {nft.price} {nft.currency}
                  </TableCell>
                  <TableCell>
                    {formatNumber(nft.minted)}/{formatNumber(nft.totalSupply)}
                  </TableCell>
                  <TableCell>{nft.createdDate}</TableCell>
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
        );
      case "artists":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">ID</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Name</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Followers</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Tracks</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Albums</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Revenue</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Verified</div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center">Join Date</div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((artist, index) => (
                <TableRow key={artist.id || index}>
                  <TableCell className="font-medium">{artist.id}</TableCell>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell>{formatNumber(artist.followers)}</TableCell>
                  <TableCell>{artist.tracks}</TableCell>
                  <TableCell>{artist.albums}</TableCell>
                  <TableCell>${formatNumber(artist.revenue)}</TableCell>
                  <TableCell>
                    {artist.verified ? (
                      <Badge
                        variant="outline"
                        className="bg-green-500/20 text-green-500"
                      >
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/20 text-amber-500"
                      >
                        Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{artist.joinDate}</TableCell>
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={() => setActiveTab("reports")}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download Reports
          </Button>
        </div>
      </div>
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="songs">Songs</TabsTrigger>
          <TabsTrigger value="nfts">NFTs</TabsTrigger>
          <TabsTrigger value="applications">
            Applications
            {activeApplications > 0 && (
              <Badge className="w-5 h-5 ml-1 flex items-center justify-center rounded-full">
                {activeApplications}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage your platform users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) =>
                    setItemsPerPage(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={currentPage === pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="songs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Song Management</CardTitle>
              <CardDescription>Manage your platform songs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search songs..."
                    className="pl-8"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) =>
                    setItemsPerPage(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={currentPage === pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nfts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NFT Management</CardTitle>
              <CardDescription>Manage your platform NFTs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search NFTs..."
                    className="pl-8"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="album">Album</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="collectible">Collectible</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) =>
                    setItemsPerPage(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={currentPage === pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <ArtistApplications
            setActiveApplications={setActiveApplications}
            filter={applicationsFilter}
            setFilter={setApplicationsFilter}
            sorting={applicationsSorting}
            setSorting={setApplicationsSorting}
            getSortIcon={getSortIcon}
            handleSort={handleSort}
          />
        </TabsContent>

        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Artist Management</CardTitle>
              <CardDescription>Manage your platform artists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search artists..."
                    className="pl-8"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Verification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Artists</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) =>
                    setItemsPerPage(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                  {totalItems} entries
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={currentPage === pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MoreHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}
