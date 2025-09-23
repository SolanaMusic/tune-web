import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationWrapperProps {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function PaginationWrapper({
  pageNumber,
  totalPages,
  totalCount,
  onPageChange,
}: PaginationWrapperProps) {
  if (totalCount === 0) return null;

  const getPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (pageNumber <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (pageNumber >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      pageNumber - 1,
      pageNumber,
      pageNumber + 1,
      "...",
      totalPages,
    ];
  };

  const pages = getPages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={pageNumber === 1}
            onClick={() => onPageChange(pageNumber - 1)}
          />
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "..." ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={pageNumber === p}
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            disabled={pageNumber === totalPages}
            onClick={() => onPageChange(pageNumber + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
