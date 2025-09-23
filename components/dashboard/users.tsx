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
import { DashboardFilter } from "../views/admin-dashboard-view";
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

interface UsersProps {
  filter: DashboardFilter;
  setFilter: React.Dispatch<React.SetStateAction<DashboardFilter>>;
  sorting: Sorting;
  setSorting: React.Dispatch<React.SetStateAction<Sorting>>;
  getSortIcon: (sorting: Sorting, column: string) => React.ReactNode;
}

export function Users({
  filter,
  setFilter,
  sorting,
  setSorting,
  getSortIcon,
}: UsersProps) {
  const [users, setUsers] = useState<PaginatedResponse>();
  const [isLoading, setIsLoading] = useState(true);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const startItem =
    users?.totalCount === 0
      ? 0
      : (users?.pageNumber! - 1) * filter.pageSize + 1;
  const endItem = Math.min(
    (users?.pageNumber ?? 1) * filter.pageSize,
    users?.totalCount || 0
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const queryParams = buildQueryParams(filter, sorting);
        const response = await axios.get<PaginatedResponse>(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }dashboard/users?${queryParams.toString()}`
        );

        setUsers(response.data);
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
                  className="w-[150px]"
                  onClick={() => handleSort("id", setSorting)}
                >
                  <div className="flex items-center">
                    ID {getSortIcon(sorting, "id")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("userName", setSorting)}
                  className="w-[350px]"
                >
                  <div className="flex items-center">
                    User {getSortIcon(sorting, "userName")}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[350px]"
                  onClick={() => handleSort("profile.country.name", setSorting)}
                >
                  <div className="flex items-center">
                    Country {getSortIcon(sorting, "profile.country.name")}
                  </div>
                </TableHead>
                <TableHead
                  onClick={() => handleSort("profile.createdDate", setSorting)}
                >
                  <div className="flex items-center">
                    Join Date {getSortIcon(sorting, "profile.createdDate")}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.data.map((user, index) => (
                <TableRow key={user.id || index}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={getAvatarUrl(user.profile.avatarUrl)}
                        />
                        <AvatarFallback>
                          {user.userName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <CountryFlag code={user.profile.country.countryCode} />
                      <span>{user.profile.country.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(user.profile.createdDate)}
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
        </div>

        <TableFooter
          startItem={startItem}
          endItem={endItem}
          totalCount={users?.totalCount || 0}
          pageNumber={users?.pageNumber || 0}
          totalPages={users?.totalPages || 0}
          onPageChange={(page) =>
            setFilter((prev) => ({ ...prev, pageNumber: page }))
          }
        />
      </CardContent>
    </Card>
  );
}
