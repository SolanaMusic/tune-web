"use client";

import { Search, X } from "lucide-react";
import { Input } from "../../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { DashboardFilter } from "../../views/admin-dashboard-view";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface TableToolbarProps<F extends DashboardFilter> {
  filter: F;
  setFilter: React.Dispatch<React.SetStateAction<F>>;
  children?: React.ReactNode;
  debounceTime?: number;
}

export function TableToolbar<F extends DashboardFilter>({
  filter,
  setFilter,
  children,
  debounceTime = 350,
}: TableToolbarProps<F>) {
  const [searchValue, setSearchValue] = useState(filter.query);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== filter.query) {
        setFilter((prev) => ({ ...prev, query: searchValue }));
      }
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [searchValue, setFilter, filter.query, debounceTime]);

  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="w-full pl-8 pr-10"
          value={searchValue}
          autoFocus
          onChange={(e) => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={() => setSearchValue("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
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
