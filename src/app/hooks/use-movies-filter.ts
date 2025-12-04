"use client";

import {
  compareAsc,
  isAfter,
  isBefore,
  isValid,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { useMemo } from "react";

import type { Movie } from "../types/movie";

export type SortField = "title" | "date" | "rating";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  title: string;
  startDate: string | null;
  endDate: string | null;
  genreIds: number[];
  onlyWithShowtimes: boolean;
  sortBy: SortField;
  sortOrder: SortOrder;
}

export const defaultFilters: FilterState = {
  title: "",
  startDate: null,
  endDate: null,
  genreIds: [],
  onlyWithShowtimes: false,
  sortBy: "title",
  sortOrder: "asc",
};

const safeParseDate = (value: string | null) => {
  if (!value) return null;

  try {
    const parsed = parseISO(value);

    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const filterByTitle = (movies: Movie[], title: string) => {
  const trimmed = title.trim();

  if (!trimmed) return movies;

  const searchTerm = trimmed.toLowerCase();

  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm)
  );
};

const filterByDateRange = (
  movies: Movie[],
  startDateValue: string | null,
  endDateValue: string | null
): Movie[] => {
  const startDate = safeParseDate(startDateValue);
  const endDate = safeParseDate(endDateValue);

  if (!startDate && !endDate) return movies;

  return movies.filter((movie) => {
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
};

const filterByGenres = (movies: Movie[], genreIds: number[]) => {
  if (genreIds.length === 0) return movies;

  const genreIdSet = new Set(genreIds);

  return movies.filter((movie) =>
    movie.genre_ids.some((genreId) => genreIdSet.has(genreId))
  );
};

const filterByShowtimes = (
  movies: Movie[],
  onlyWithShowtimes: boolean,
  movieIdsWithShowtimes?: Set<number>
) => {
  if (!onlyWithShowtimes) return movies;
  if (!movieIdsWithShowtimes || movieIdsWithShowtimes.size === 0) {
    return [];
  }

  return movies.filter((movie) => movieIdsWithShowtimes.has(movie.id));
};

const sortMovies = (
  movies: Movie[],
  sortBy: SortField,
  sortOrder: SortOrder
) => {
  const sorted = [...movies];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "date": {
        const dateA = parseISO(a.release_date);
        const dateB = parseISO(b.release_date);
        comparison = compareAsc(dateA, dateB);
        break;
      }
      case "rating":
        comparison = a.vote_average - b.vote_average;
        break;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return sorted;
};

export const applyMovieFilters = (
  movies: Movie[],
  filters: FilterState,
  movieIdsWithShowtimes?: Set<number>
) => {
  const afterTitle = filterByTitle(movies, filters.title);
  const afterDate = filterByDateRange(
    afterTitle,
    filters.startDate,
    filters.endDate
  );

  const afterGenres = filterByGenres(afterDate, filters.genreIds);
  const afterShowtimes = filterByShowtimes(
    afterGenres,
    filters.onlyWithShowtimes,
    movieIdsWithShowtimes
  );

  return sortMovies(afterShowtimes, filters.sortBy, filters.sortOrder);
};

export const useMoviesFilter = (
  movies: Movie[],
  filters: FilterState,
  movieIdsWithShowtimes?: Set<number>
) => {
  return useMemo(
    () => applyMovieFilters(movies, filters, movieIdsWithShowtimes),
    [movies, filters, movieIdsWithShowtimes]
  );
};
