"use client";

import { PaginationWrapper } from "@/components/ui/pagination-wrapper";

interface TableFooterProps {
  startItem: number;
  endItem: number;
  totalCount: number;
  pageNumber: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TableFooter({
  startItem,
  endItem,
  totalCount,
  pageNumber,
  totalPages,
  onPageChange,
}: TableFooterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        Showing {startItem} to {endItem} of {totalCount} entries
      </div>

      <PaginationWrapper
        pageNumber={pageNumber}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
