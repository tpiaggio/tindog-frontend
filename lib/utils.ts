import {type ClassValue, clsx} from "clsx";
import {Timestamp} from "firebase/firestore";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (dogId: string | undefined) => {
  if (!dogId) {
    return "";
  }
  const domain =
    window.location.hostname === "localhost"
      ? "http://localhost:9199"
      : "https://storage.googleapis.com";
  return `${domain}/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/dogs/${dogId}`;
};

export const getThumbnailUrl = (dogId: string) => {
  const domain =
    window.location.hostname === "localhost"
      ? "http://localhost:9199"
      : "https://storage.googleapis.com";
  return `${domain}/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/dogs/thumbnails/${dogId}_200x200`;
};

export const formatTimestamp = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  // Extract hours, minutes, and AM/PM
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "PM" : "AM";

  // Format the string
  return `${hours}:${minutes} ${ampm}`;
};
