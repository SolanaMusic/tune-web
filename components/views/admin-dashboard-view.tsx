"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DownloadIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
} from "lucide-react";
import { useRef } from "react";
import { Reports } from "../dashboard/reports";
import { Overview } from "../dashboard/overview";
import { ArtistApplications } from "../dashboard/artist-applications";
import axios from "axios";
import { Users } from "../dashboard/users";
import { Sorting } from "@/lib/utils";
import { Artists } from "../dashboard/artists";
import { Tracks } from "../dashboard/tracks";
import { Nfts } from "../dashboard/nfts";

export interface DashboardFilter {
  query: string;
  timeFilter: "Today" | "Week" | "Month" | "Year" | "AllTime";
  pageNumber: number;
  totalPages: number;
  pageSize: number;
}

export interface ArtistApplicationsFilter extends DashboardFilter {
  status: "Pending" | "Approved" | "Rejected" | "All";
}

export interface NftsFilter extends DashboardFilter {
  type: "Album" | "Track" | "Artist" | "All";
}

export interface DashboardProps {
  filter: DashboardFilter;
  setFilter: React.Dispatch<React.SetStateAction<DashboardFilter>>;
  sorting: Sorting;
  setSorting: React.Dispatch<React.SetStateAction<Sorting>>;
  getSortIcon: (sorting: Sorting, column: string) => React.ReactNode;
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

  const [applicationsSorting, setApplicationsSorting] = useState<Sorting>({
    sortColumn: "",
    sortDirection: "Asc",
  });
  const [applicationsFilter, setApplicationsFilter] =
    useState<ArtistApplicationsFilter>({
      query: "",
      timeFilter: "AllTime",
      pageNumber: 1,
      totalPages: 1,
      pageSize: 10,
      status: "All",
    });

  const [usersSorting, setUsersSorting] = useState<Sorting>({
    sortColumn: "",
    sortDirection: "Asc",
  });
  const [usersFilter, setUsersFilter] = useState<DashboardFilter>({
    query: "",
    timeFilter: "AllTime",
    pageNumber: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const [artistsSorting, setArtistsSorting] = useState<Sorting>({
    sortColumn: "",
    sortDirection: "Asc",
  });
  const [artistsFilter, setArtistsFilter] = useState<DashboardFilter>({
    query: "",
    timeFilter: "AllTime",
    pageNumber: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const [tracksSorting, setTracksSorting] = useState<Sorting>({
    sortColumn: "",
    sortDirection: "Asc",
  });
  const [tracksFilter, setTracksFilter] = useState<DashboardFilter>({
    query: "",
    timeFilter: "AllTime",
    pageNumber: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const [nftsSorting, setNftsSorting] = useState<Sorting>({
    sortColumn: "",
    sortDirection: "Asc",
  });
  const [nftsFilter, setNftsFilter] = useState<NftsFilter>({
    query: "",
    timeFilter: "AllTime",
    pageNumber: 1,
    totalPages: 1,
    pageSize: 10,
    type: "All",
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPendingApplications();
      setActiveApplications(response);
    };

    fetchData();
  }, []);

  const getSortIcon = (sorting: Sorting, column: string) => {
    if (sorting.sortColumn !== column) {
      return <ArrowUpDownIcon className="ml-2 h-4 w-4" />;
    }
    return sorting.sortDirection === "Asc" ? (
      <ArrowUpIcon className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDownIcon className="ml-2 h-4 w-4" />
    );
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
          <TabsTrigger value="tracks">Tracks</TabsTrigger>
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
          <Users
            filter={usersFilter}
            setFilter={setUsersFilter}
            sorting={usersSorting}
            setSorting={setUsersSorting}
            getSortIcon={getSortIcon}
          />
        </TabsContent>
        <TabsContent value="artists" className="space-y-4">
          <Artists
            filter={artistsFilter}
            setFilter={setArtistsFilter}
            sorting={artistsSorting}
            setSorting={setArtistsSorting}
            getSortIcon={getSortIcon}
          />
        </TabsContent>
        <TabsContent value="tracks" className="space-y-4">
          <Tracks
            filter={tracksFilter}
            setFilter={setTracksFilter}
            sorting={tracksSorting}
            setSorting={setTracksSorting}
            getSortIcon={getSortIcon}
          />
        </TabsContent>
        <TabsContent value="nfts" className="space-y-4">
          <Nfts
            filter={nftsFilter}
            setFilter={setNftsFilter}
            sorting={nftsSorting}
            setSorting={setNftsSorting}
            getSortIcon={getSortIcon}
          />
        </TabsContent>
        <TabsContent value="applications" className="space-y-4">
          <ArtistApplications
            setActiveApplications={setActiveApplications}
            filter={applicationsFilter}
            setFilter={setApplicationsFilter}
            sorting={applicationsSorting}
            setSorting={setApplicationsSorting}
            getSortIcon={getSortIcon}
          />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Reports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
