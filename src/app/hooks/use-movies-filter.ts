"use client";

import {
  isAfter,
  isBefore,
  isValid,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { useMemo } from "react";
import type { Movie } from "../types/movie";

export interface FilterState {
  title: string;
  startDate: string | null;
  endDate: string | null;
  genreIds: number[];
}

const defaultFilters: FilterState = {
  title: "",
  startDate: null,
  endDate: null,
  genreIds: [],
};

const safeParseDate = (value: string | null): Date | null => {
  if (!value) return null;

  try {
    const parsed = parseISO(value);

    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const useMoviesFilter = (
  movies: Movie[],
  filters: FilterState
): Movie[] => {
  return useMemo(() => {
    let filtered = [...movies];

    // Filter by title
    if (filters.title.trim()) {
      const searchTerm = filters.title.toLowerCase().trim();

      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by date range
    const startDate = safeParseDate(filters.startDate);
    const endDate = safeParseDate(filters.endDate);

    if (startDate || endDate) {
      filtered = filtered.filter((movie) => {
        const movieDate = parseISO(movie.release_date);

        if (startDate && endDate) {
          return isWithinInterval(movieDate, {
            start: startDate,
            end: endDate,
          });
        }

        if (startDate) {
          return (
            isAfter(movieDate, startDate) ||
            movieDate.getTime() === startDate.getTime()
          );
        }

        if (endDate) {
          return (
            isBefore(movieDate, endDate) ||
            movieDate.getTime() === endDate.getTime()
          );
        }

        return true;
      });
    }

    // Filter by genres
    if (filters.genreIds.length > 0) {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.some((genreId) => filters.genreIds.includes(genreId))
      );
    }

    return filtered;
  }, [movies, filters]);
};

export { defaultFilters };
