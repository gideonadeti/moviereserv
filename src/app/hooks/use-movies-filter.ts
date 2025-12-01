"use client";

import { useMemo } from "react";
import type { Movie } from "../types/movie";

export interface FilterState {
  title: string;
}

const defaultFilters: FilterState = {
  title: "",
};

export const useMoviesFilter = (movies: Movie[], filters: FilterState) => {
  return useMemo(() => {
    const term = filters.title.trim().toLowerCase();

    if (!term) return movies;

    return movies.filter((movie) => movie.title.toLowerCase().includes(term));
  }, [movies, filters.title]);
};

export { defaultFilters };
