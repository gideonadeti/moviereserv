import { parseISO } from "date-fns";

import type { Movie } from "../types/movie";
import type { Showtime } from "../types/showtime";
import useUser from "./use-user";

export type ShowtimesSortField = "startTime" | "price";

export type ShowtimesSortOrder = "asc" | "desc";

export interface ShowtimesFilterState {
  title: string;
  startDate: string | null;
  endDate: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  /**
   * When enabled, only showtimes that the current user has at least one
   * reservation for will be included in the results.
   */
  onlyWithReservations: boolean;
  sortBy: ShowtimesSortField;
  sortOrder: ShowtimesSortOrder;
}

export const defaultShowtimesFilters: ShowtimesFilterState = {
  title: "",
  startDate: null,
  endDate: null,
  minPrice: null,
  maxPrice: null,
  onlyWithReservations: false,
  sortBy: "startTime",
  sortOrder: "asc",
};

const toDateSafe = (value: string | null | undefined) => {
  if (!value) return null;
  try {
    const parsed = parseISO(value);

    // date-fns parseISO throws on invalid, but be defensive anyway
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const compareValues = (a: unknown, b: unknown, order: ShowtimesSortOrder) => {
  if (a == null && b == null) return 0;
  if (a == null) return order === "asc" ? 1 : -1;
  if (b == null) return order === "asc" ? -1 : 1;

  if (a < b) return order === "asc" ? -1 : 1;
  if (a > b) return order === "asc" ? 1 : -1;
  return 0;
};

interface UseShowtimesFilterParams {
  showtimes: Showtime[];
  movies: Movie[];
  filters: ShowtimesFilterState;
}

export const useShowtimesFilter = ({
  showtimes,
  movies,
  filters,
}: UseShowtimesFilterParams) => {
  const { user } = useUser();

  const startDate = toDateSafe(filters.startDate);
  const endDate = toDateSafe(filters.endDate);
  const trimmedTitle = filters.title.trim().toLowerCase();

  const moviesById = new Map(movies.map((movie) => [movie.id, movie]));

  const filtered = showtimes.filter((showtime) => {
    // Date range filter (against startTime)
    const showtimeStart = parseISO(showtime.startTime);

    if (startDate && showtimeStart < startDate) {
      return false;
    }

    if (endDate && showtimeStart > endDate) {
      return false;
    }

    // Price range filter
    if (filters.minPrice != null && showtime.price < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice != null && showtime.price > filters.maxPrice) {
      return false;
    }

    // Title filter (via movies list)
    if (trimmedTitle) {
      const movie = moviesById.get(showtime.tmdbMovieId);

      if (!movie) {
        return false;
      }

      const title = movie.title.toLowerCase();

      if (!title.includes(trimmedTitle)) {
        return false;
      }
    }

    // Only showtimes with reservations for the current user
    if (filters.onlyWithReservations) {
      // If there is no logged-in user, we can't have user-specific reservations
      if (!user?.id) {
        return false;
      }

      const hasUserReservation =
        showtime.reservations?.some(
          (reservation) => reservation.userId === user.id
        ) ?? false;

      if (!hasUserReservation) {
        return false;
      }
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case "price":
        return compareValues(a.price, b.price, filters.sortOrder);
      case "startTime":
        return compareValues(
          parseISO(a.startTime).getTime(),
          parseISO(b.startTime).getTime(),
          filters.sortOrder
        );
      default:
        return 0;
    }
  });

  return sorted;
};
