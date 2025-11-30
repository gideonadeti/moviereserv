"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "../components/movie-card";
import MoviesFilters from "../components/movies-filters";
import MoviesSort from "../components/movies-sort";
import useMovies from "../hooks/use-movies";
import {
  defaultFilters,
  type FilterState,
  useMoviesFilter,
} from "../hooks/use-movies-filter";

const MOVIES_PER_BATCH = 20;

const MoviesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { moviesQuery, genresQuery } = useMovies();
  const isLoading = moviesQuery.isPending || genresQuery.isPending;

  // Initialize filters from URL params
  const [filters, setFilters] = useState<FilterState>(() => {
    const title = searchParams.get("title") || defaultFilters.title;
    const startDate = searchParams.get("startDate") || defaultFilters.startDate;
    const endDate = searchParams.get("endDate") || defaultFilters.endDate;
    const genreIdsParam = searchParams.get("genreIds");
    const genreIds = genreIdsParam
      ? genreIdsParam.split(",").map(Number)
      : defaultFilters.genreIds;

    const sortBy =
      (searchParams.get("sortBy") as FilterState["sortBy"]) ||
      defaultFilters.sortBy;

    const sortOrder =
      (searchParams.get("sortOrder") as FilterState["sortOrder"]) ||
      defaultFilters.sortOrder;

    return {
      title,
      startDate,
      endDate,
      genreIds,
      sortBy,
      sortOrder,
    };
  });

  const [displayedCount, setDisplayedCount] = useState(MOVIES_PER_BATCH);
  const movies = moviesQuery.data || [];
  const genres = genresQuery.data || [];

  // Get available genre IDs from movies
  const availableGenreIds = useMemo(() => {
    return new Set(movies.flatMap((movie) => movie.genre_ids));
  }, [movies]);

  // Filter and sort movies
  const filteredMovies = useMoviesFilter(movies, filters);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(MOVIES_PER_BATCH);
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.title) params.set("title", filters.title);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.genreIds.length > 0)
      params.set("genreIds", filters.genreIds.join(","));

    if (filters.sortBy !== defaultFilters.sortBy)
      params.set("sortBy", filters.sortBy);

    if (filters.sortOrder !== defaultFilters.sortOrder)
      params.set("sortOrder", filters.sortOrder);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  // Displayed movies (for load more)
  const displayedMovies = filteredMovies.slice(0, displayedCount);
  const hasMore = displayedCount < filteredMovies.length;

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + MOVIES_PER_BATCH);
  };

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSortChange = useCallback(
    (sortBy: FilterState["sortBy"], sortOrder: FilterState["sortOrder"]) => {
      setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    },
    []
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Filters Skeleton */}
          <div className="space-y-4">
            {/* Title Search Skeleton */}
            <Skeleton className="h-9 w-full" />

            {/* Date Pickers and Genre Filter Skeleton */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Skeleton className="h-9 w-full sm:w-[200px]" />
              <Skeleton className="h-9 w-full sm:w-[200px]" />
              <Skeleton className="h-9 flex-1" />
            </div>

            {/* Sort Skeleton */}
            <div className="flex justify-end">
              <Skeleton className="h-9 w-[200px]" />
            </div>
          </div>

          {/* Movies Grid Skeleton */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i.toString()} className="h-[500px] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Movies</h1>
          <p className="text-muted-foreground">
            {filteredMovies.length} movie
            {filteredMovies.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="space-y-4">
          <MoviesFilters
            genres={genres}
            availableGenreIds={availableGenreIds}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <div className="flex justify-end">
            <MoviesSort
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        {/* Movies Grid */}
        {displayedMovies.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No movies found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedMovies.map((movie) => (
                <div key={movie.id} className="h-[500px]">
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="py-8 text-center">
                <Button onClick={handleLoadMore} variant="outline">
                  Load More
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Showing {displayedCount} of {filteredMovies.length} movies
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
