import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTimeAgo = (date: Date) => {
  // Convert input string to Date object

  // Get current date
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = +currentDate - +date;

  // Calculate the time ago in days, months, and years
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const monthsAgo = Math.floor(daysAgo / 30);
  const yearsAgo = Math.floor(monthsAgo / 12);

  // Check if it was today
  if (daysAgo === 0) {
    return "today";
  } else if (daysAgo === 1) {
    return "yesterday";
  } else if (daysAgo < 30) {
    return `${daysAgo} days ago`;
  } else if (monthsAgo < 12) {
    return `${monthsAgo} months ago`;
  } else {
    return `${yearsAgo} years ago`;
  }
};
