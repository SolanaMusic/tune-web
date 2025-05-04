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
  MusicIcon,
  UsersIcon,
  BarChart3Icon,
  TrendingUpIcon,
  CoinsIcon,
  SearchIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  UserIcon,
} from "lucide-react";
import { LineChart, BarChart, PieChart } from "@/components/ui/chart";
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

export function AdminDashboardView() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const tableContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) {
      return <ArrowUpDownIcon className="ml-2 h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
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
                <TableHead
                  className="w-[100px]"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Name {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("email")}>
                  <div className="flex items-center">
                    Email {getSortIcon("email")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("plan")}>
                  <div className="flex items-center">
                    <span>Plan</span> {getSortIcon("plan")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("status")}>
                  <div className="flex items-center">
                    Status {getSortIcon("status")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("joinDate")}>
                  <div className="flex items-center">
                    Date {getSortIcon("joinDate")}
                  </div>
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
                <TableHead
                  className="w-[100px]"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("title")}>
                  <div className="flex items-center">
                    Title {getSortIcon("title")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("artist")}>
                  <div className="flex items-center">
                    Artist {getSortIcon("artist")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("album")}>
                  <div className="flex items-center">
                    Album {getSortIcon("album")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("plays")}>
                  <div className="flex items-center">
                    Plays {getSortIcon("plays")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("duration")}>
                  <div className="flex items-center">
                    Duration {getSortIcon("duration")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("releaseDate")}>
                  <div className="flex items-center">
                    Release Date {getSortIcon("releaseDate")}
                  </div>
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
                <TableHead
                  className="w-[100px]"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("title")}>
                  <div className="flex items-center">
                    Title {getSortIcon("title")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("artist")}>
                  <div className="flex items-center">
                    Artist {getSortIcon("artist")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("type")}>
                  <div className="flex items-center">
                    Type {getSortIcon("type")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("price")}>
                  <div className="flex items-center">
                    Price {getSortIcon("price")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("minted")}>
                  <div className="flex items-center">
                    Minted {getSortIcon("minted")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("createdDate")}>
                  <div className="flex items-center">
                    Created Date {getSortIcon("createdDate")}
                  </div>
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
                <TableHead
                  className="w-[100px]"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID {getSortIcon("id")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("name")}>
                  <div className="flex items-center">
                    Name {getSortIcon("name")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("followers")}>
                  <div className="flex items-center">
                    Followers {getSortIcon("followers")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("tracks")}>
                  <div className="flex items-center">
                    Tracks {getSortIcon("tracks")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("albums")}>
                  <div className="flex items-center">
                    Albums {getSortIcon("albums")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("revenue")}>
                  <div className="flex items-center">
                    Revenue {getSortIcon("revenue")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("verified")}>
                  <div className="flex items-center">
                    Verified {getSortIcon("verified")}
                  </div>
                </TableHead>
                <TableHead onClick={() => handleSort("joinDate")}>
                  <div className="flex items-center">
                    Join Date {getSortIcon("joinDate")}
                  </div>
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
          <Button>
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
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Users
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Songs
                </CardTitle>
                <MusicIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,432</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={[
                    { name: "Jan", total: 1200 },
                    { name: "Feb", total: 1900 },
                    { name: "Mar", total: 1800 },
                    { name: "Apr", total: 2400 },
                    { name: "May", total: 2700 },
                    { name: "Jun", total: 3100 },
                    { name: "Jul", total: 3500 },
                    { name: "Aug", total: 3200 },
                    { name: "Sep", total: 3800 },
                    { name: "Oct", total: 4200 },
                    { name: "Nov", total: 4600 },
                    { name: "Dec", total: 5100 },
                  ]}
                  categories={["total"]}
                  colors={["#2563eb"]}
                  valueFormatter={(value) => `$${value}`}
                  className="h-60 w-1/2"
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>
                  Breakdown of subscription plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: "Basic", value: 35 },
                    { name: "Premium", value: 45 },
                    { name: "Family", value: 20 },
                  ]}
                  category="value"
                  index="name"
                  valueFormatter={(value) => `${value}%`}
                  colors={["#2563eb", "#4ade80", "#f97316"]}
                  className="h-60 w-1/2"
                  label={({ dataEntry }) =>
                    `${dataEntry.name}: ${dataEntry.value}%`
                  }
                  labelStyle={{
                    fill: "#ffffff",
                    fontSize: "6px",
                    fontWeight: "bold",
                  }}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart
                  data={[
                    { name: "Jan", total: 580 },
                    { name: "Feb", total: 690 },
                    { name: "Mar", total: 1100 },
                    { name: "Apr", total: 1200 },
                    { name: "May", total: 1380 },
                    { name: "Jun", total: 1450 },
                    { name: "Jul", total: 1700 },
                    { name: "Aug", total: 1520 },
                    { name: "Sep", total: 1900 },
                    { name: "Oct", total: 2300 },
                    { name: "Nov", total: 2400 },
                    { name: "Dec", total: 2550 },
                  ]}
                  index="name"
                  categories={["total"]}
                  colors={["#8b5cf6"]}
                  valueFormatter={(value) => `${value}`}
                  className="h-60 w-1/2"
                />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>NFT Sales</CardTitle>
                <CardDescription>Monthly NFT sales volume</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <LineChart
                  data={[
                    { name: "Jan", total: 12000 },
                    { name: "Feb", total: 18000 },
                    { name: "Mar", total: 15000 },
                    { name: "Apr", total: 22000 },
                    { name: "May", total: 28000 },
                    { name: "Jun", total: 32000 },
                    { name: "Jul", total: 36000 },
                    { name: "Aug", total: 30000 },
                    { name: "Sep", total: 38000 },
                    { name: "Oct", total: 42000 },
                    { name: "Nov", total: 48000 },
                    { name: "Dec", total: 52000 },
                  ]}
                  categories={["total"]}
                  colors={["#ec4899"]}
                  valueFormatter={(value) => `$${value}`}
                  className="h-60 w-1/2"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage your platform users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
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

              {/* Table */}
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>

              {/* Pagination */}
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

        {/* Songs Tab */}
        <TabsContent value="songs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Song Management</CardTitle>
              <CardDescription>Manage your platform songs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
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

              {/* Table */}
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>

              {/* Pagination */}
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

        {/* NFTs Tab */}
        <TabsContent value="nfts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NFT Management</CardTitle>
              <CardDescription>Manage your platform NFTs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
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

              {/* Table */}
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>

              {/* Pagination */}
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

        {/* Artists Tab */}
        <TabsContent value="artists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Artist Management</CardTitle>
              <CardDescription>Manage your platform artists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
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

              {/* Table */}
              <div
                className="rounded-md border"
                ref={tableContainerRef}
                style={{ height: "400px", overflow: "auto" }}
              >
                {renderTable()}
              </div>

              {/* Pagination */}
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

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and download reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5" /> User Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a detailed report of user activity,
                      registrations, and engagement metrics.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MusicIcon className="h-5 w-5" /> Content Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a report on music content, including plays,
                      uploads, and popularity metrics.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CoinsIcon className="h-5 w-5" /> NFT Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a report on NFT sales, minting activity, and
                      marketplace performance.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUpIcon className="h-5 w-5" /> Revenue Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a financial report with revenue breakdowns,
                      subscription data, and payment analytics.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" /> Artist Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a report on artist performance, earnings, and
                      content engagement metrics.
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3Icon className="h-5 w-5" /> Custom Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create a custom report by selecting specific metrics and
                      data points to include.
                    </p>
                    <Button className="w-full">Create Custom Report</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
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
