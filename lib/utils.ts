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

export function timeAgo(dateString: string) {
  const date = parseDateString(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}

export function splitByCaps(text: string): string {
  if (!text) return "";
  return text.replace(/([A-Z])/g, " $1").trim();
}

export const getAvatarUrl = (avatarUrl: string) => {
  if (!avatarUrl) return "/placeholder.svg";

  return avatarUrl.startsWith("http")
    ? avatarUrl
    : `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}${avatarUrl}`;
};

export function serializeParams(params: Record<string, any>): string {
  return Object.entries(params)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&")
        : `${key}=${encodeURIComponent(value)}`
    )
    .join("&");
}

export const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (value: string | null) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }
};

export const removeFile = (
  ref: React.RefObject<HTMLInputElement | null>,
  setPreview: (value: string | null) => void
) => {
  setPreview(null);
  if (ref.current) {
    ref.current.value = "";
  }
};

export const triggerFileInput = (
  ref: React.RefObject<HTMLInputElement | null>
) => {
  ref.current?.click();
};

function parseDateString(dateString: string) {
  const normalized = dateString.replace(" ", "T").split(".")[0];
  return new Date(normalized + "Z");
}

export const statusStyles: Record<string, string> = {
  Completed: "bg-green-500/20 text-green-500",
  Pending: "bg-blue-500/20 text-blue-500",
  Failed: "bg-red-500/20 text-red-500",
  Refunded: "bg-amber-500/20 text-amber-500",
  Expired: "bg-gray-500/20 text-gray-500",
  Unknown: "bg-muted/20 text-muted-foreground",
};
