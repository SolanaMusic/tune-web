import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Sorting {
  sortColumn: string;
  sortDirection: "Asc" | "Desc";
}

export function buildQueryParams(
  filter: any,
  sorting?: Sorting
): URLSearchParams {
  const queryParams = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  if (sorting?.sortColumn) {
    queryParams.append("sortColumn", sorting.sortColumn);
    queryParams.append("sortDirection", sorting.sortDirection ?? "Asc");
  }

  return queryParams;
}

export const handleSort = (
  column: string,
  setSorting: React.Dispatch<React.SetStateAction<Sorting>>
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

export const formatDateTime = (dateString: string | Date) => {
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

export const getAvatarUrl = (avatarUrl: string) => {
  if (!avatarUrl) return "/placeholder.svg";

  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${avatarUrl}`;
};
