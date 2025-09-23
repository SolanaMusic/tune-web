"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "../../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { DashboardFilter } from "../../views/admin-dashboard-view";

interface TableToolbarProps<F extends DashboardFilter> {
  filter: F;
  setFilter: React.Dispatch<React.SetStateAction<F>>;
  children?: React.ReactNode;
}

export function TableToolbar<F extends DashboardFilter>({
  filter,
  setFilter,
  children,
}: TableToolbarProps<F>) {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-8"
          value={filter.query}
          onChange={(e) =>
            setFilter((prev) => ({ ...prev, query: e.target.value }))
          }
        />
      </div>

      {children}

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
  );
}
