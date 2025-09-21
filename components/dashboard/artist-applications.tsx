"use client";

import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  FileQuestion,
  Globe,
  Loader2,
  MapPin,
  SearchIcon,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
  PaginatedResponse,
} from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArtistApplicationsFilter,
  DashboardSorting,
  fetchPendingApplications,
} from "../views/admin-dashboard-view";
import axios from "axios";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "../ui/label";
import Link from "next/link";
import { useUserStore } from "@/stores/UserStore";
import { Textarea } from "../ui/textarea";

interface ArtistApplicationsProps {
  activeApplications: number;
  setActiveApplications: React.Dispatch<React.SetStateAction<number>>;
  filter: ArtistApplicationsFilter;
  setFilter: React.Dispatch<React.SetStateAction<ArtistApplicationsFilter>>;
  sorting: DashboardSorting;
  setSorting: React.Dispatch<React.SetStateAction<DashboardSorting>>;
  getSortIcon: (sorting: DashboardSorting, column: string) => React.ReactNode;
  handleSort: (
    column: string,
    sorting: DashboardSorting,
    setSorting: React.Dispatch<React.SetStateAction<DashboardSorting>>
  ) => void;
}

export function ArtistApplications({
  activeApplications,
  setActiveApplications,
  filter,
  setFilter,
  sorting,
  setSorting,
  getSortIcon,
  handleSort,
}: ArtistApplicationsProps) {
  const [applications, setApplications] = useState<PaginatedResponse>();
  const [countries, setCountries] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [artistName, setArtistName] = useState("");
  const [artistBio, setArtistBio] = useState("");
  const [artistCountry, setArtistCountry] = useState<any>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();

  const totalItems = applications?.data.length ?? 0;
  const startItem =
    totalItems === 0
      ? 0
      : (applications?.pageNumber! - 1) * filter.pageSize + 1;
  const endItem = Math.min(
    (applications?.pageNumber ?? 1) * filter.pageSize,
    totalItems
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const queryParams = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            queryParams.append(key, String(value));
          }
        });

        if (sorting.sortColumn) {
          queryParams.append("sortColumn", sorting.sortColumn);
          queryParams.append("sortDirection", sorting.sortDirection);
        }

        const applicationsRequest = axios.get<PaginatedResponse>(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }dashboard/applications?${queryParams.toString()}`
        );
        const activeApplicationsRequest = fetchPendingApplications();
        const countriesRequest = axios.get<string[]>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}countries`
        );

        const [
          applicationsResponse,
          activeApplicationsResponse,
          countriesResponse,
        ] = await Promise.all([
          applicationsRequest,
          activeApplicationsRequest,
          countriesRequest,
        ]);

        setApplications(applicationsResponse.data);
        setActiveApplications(activeApplicationsResponse);
        setCountries(countriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filter, sorting]);

  const handleSubmit = async (status: string) => {
    if (!selectedApplication) return;
    if (!user) return;

    try {
      const body: {
        status: string;
        reviewerId: string;
        artistName?: string;
        bio?: string;
        countryId?: string;
      } = { status, reviewerId: user.id.toString() };

      if (status === "Approved") {
        body.artistName = artistName;
        body.bio = artistBio;
        body.countryId = artistCountry.id;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}artists/applications/${selectedApplication.id}`,
        body
      );

      setApplications((prev) => {
        if (!prev) return prev;

        const updatedData = prev.data.map((application) =>
          application.id === selectedApplication.id
            ? {
                ...application,
                status: response.data.status,
                reviewer: response.data.reviewer,
              }
            : application
        );

        return { ...prev, data: updatedData };
      });

      if (status === "Rejected" || status === "Approved") {
        setActiveApplications((prev) =>
          status === "Rejected" || (status === "Approved" && prev > 0)
            ? prev - 1
            : prev
        );
      }

      setIsViewDialogOpen(false);
    } catch (error) {
      console.error("Error updating the application:", error);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!artistName.trim()) {
      newErrors.artistName = "Artist name is required";
    }

    if (!artistBio.trim() || artistBio.length < 10) {
      newErrors.artistBio = "Bio must be at least 10 characters";
    }

    if (!artistCountry) {
      newErrors.artistCountry = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "Approved":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-500">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-500">
            <FileQuestion className="mr-1 h-3 w-3" />
            Unknown
          </Badge>
        );
    }
  };

  const getAvatarUrl = (avatarUrl: string) => {
    if (!avatarUrl) return "/placeholder.svg";

    return avatarUrl.startsWith("http")
      ? avatarUrl
      : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${avatarUrl}`;
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-20 w-20 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Artist Application Details</DialogTitle>
            <DialogDescription>
              Review the complete application for{" "}
              {selectedApplication?.stageName}
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={getAvatarUrl(
                            selectedApplication.user.profile.avatarUrl
                          )}
                        />
                        <AvatarFallback>
                          {selectedApplication.user.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {selectedApplication.user.userName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedApplication.user.email}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {selectedApplication.user.profile.country.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Joined{" "}
                        {formatDateTime(
                          selectedApplication.user.profile.createdDate
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Application Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Status:</span>
                      {getStatusBadge(selectedApplication.status)}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Submitted:</span>{" "}
                      {formatDateTime(selectedApplication.createdDate)}
                    </div>
                    {selectedApplication.reviewer && (
                      <div className="text-sm">
                        <span className="font-medium">Reviewed:</span>{" "}
                        {formatDateTime(selectedApplication.updatedDate)}
                      </div>
                    )}
                    {selectedApplication.reviewer && (
                      <div className="text-sm">
                        <span className="font-medium">Reviewed by:</span>{" "}
                        {selectedApplication.reviewer.userName}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Artist Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={selectedApplication.resourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedApplication.resourceUrl}
                      </Link>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Contacts</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <Link
                        href={selectedApplication.contactLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedApplication.contactLink}
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedApplication.status === "Pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsRejectDialogOpen(true);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsApproveDialogOpen(true);
                    }}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Artist Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve{" "}
              {selectedApplication?.user.userName}
              's application?
              <p>This will grant them access to artist features.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="artistName" className="text-sm font-medium">
                Artist Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="artistName"
                placeholder="Enter artist name"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
              />
              {errors.artistName && (
                <p className="text-sm text-red-500">{errors.artistName}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="bio"
                placeholder="Enter artist bio"
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                value={artistBio}
                onChange={(e) => setArtistBio(e.target.value)}
              />
              {errors.artistBio && (
                <p className="text-sm text-red-500">{errors.artistBio}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="country" className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </Label>
              <Select
                value={artistCountry ? JSON.stringify(artistCountry) : ""}
                onValueChange={(val) => setArtistCountry(JSON.parse(val))}
              >
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country: any) => (
                    <SelectItem
                      key={country.id}
                      value={JSON.stringify(country)}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.artistCountry && (
                <p className="text-sm text-red-500">{errors.artistCountry}</p>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                if (validateForm()) {
                  handleSubmit("Approved");
                  setIsApproveDialogOpen(false);
                }
              }}
            >
              Approve
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Artist Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject{" "}
              {selectedApplication?.user.userName}'s application?
              <p>
                The user will be notified their application was not approved.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleSubmit("Rejected")}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CardHeader>
        <CardTitle>Artist Applications</CardTitle>
        <CardDescription>
          Review and manage artist verification applications
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              className="pl-8"
              value={filter.query}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, query: e.target.value }))
              }
            />
          </div>

          <Select
            value={filter.status}
            onValueChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                status: value as "Pending" | "Approved" | "Rejected" | "All",
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter.timeFilter}
            onValueChange={(value) =>
              setFilter((prev) => ({
                ...prev,
                timeFilter: value as
                  | "Today"
                  | "Week"
                  | "Month"
                  | "Year"
                  | "AllTime",
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AllTime">All Time</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Week">This Week</SelectItem>
              <SelectItem value="Month">This Month</SelectItem>
              <SelectItem value="Year">This Year</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={String(filter.pageSize)}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, pageSize: parseInt(value) }))
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="w-[100px]"
                  onClick={() => handleSort("id", sorting, setSorting)}
                >
                  <div className="flex items-center">
                    ID {getSortIcon(sorting, "id")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() =>
                    handleSort("user.userName", sorting, setSorting)
                  }
                >
                  <div className="flex items-center">
                    User {getSortIcon(sorting, "user.userName")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("status", sorting, setSorting)}
                >
                  <div className="flex items-center">
                    Status {getSortIcon(sorting, "status")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("createdDate", sorting, setSorting)}
                >
                  <div className="flex items-center">
                    Submitted {getSortIcon(sorting, "createdDate")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() =>
                    handleSort("reviewer.userName", sorting, setSorting)
                  }
                >
                  <div className="flex items-center">
                    Reviewer {getSortIcon(sorting, "reviewer.userName")}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications?.data.map((application, index) => (
                <TableRow key={application.id || index}>
                  <TableCell className="font-medium">
                    {application.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={getAvatarUrl(application.user.profile.avatarUrl)}
                        />
                        <AvatarFallback>
                          {application.user.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {application.user.userName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {application.user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(application.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(application.createdDate)}
                  </TableCell>
                  <TableCell>{application.reviewer?.userName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedApplication(application);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      {application.status === "Pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 bg-transparent"
                            onClick={() => {
                              setSelectedApplication(application);
                              setIsApproveDialogOpen(true);
                            }}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => {
                              setSelectedApplication(application);
                              setIsRejectDialogOpen(true);
                            }}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            Showing {startItem} to {endItem} of {totalItems} entries
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      pageNumber: Math.max(prev.pageNumber - 1, 1),
                    }))
                  }
                  disabled={applications?.pageNumber === 1 || totalItems === 0}
                />
              </PaginationItem>

              {Array.from(
                { length: Math.min(5, applications?.totalPages ?? 1) },
                (_, i) => {
                  let pageNum;
                  if ((applications?.totalPages ?? 1) <= 5) pageNum = i + 1;
                  else if ((applications?.pageNumber ?? 1) <= 3)
                    pageNum = i + 1;
                  else if (
                    (applications?.pageNumber ?? 1) >=
                    (applications?.totalPages ?? 1) - 2
                  )
                    pageNum = (applications?.totalPages ?? 1) - 4 + i;
                  else pageNum = (applications?.pageNumber ?? 1) - 2 + i;

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        isActive={(applications?.pageNumber ?? 1) === pageNum}
                        onClick={() =>
                          setFilter((prev) => ({
                            ...prev,
                            pageNumber: pageNum,
                          }))
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setFilter((prev) => ({
                      ...prev,
                      pageNumber: Math.min(
                        prev.pageNumber + 1,
                        applications?.totalPages ?? 1
                      ),
                    }))
                  }
                  disabled={
                    applications?.pageNumber === applications?.totalPages ||
                    totalItems === 0
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
}
