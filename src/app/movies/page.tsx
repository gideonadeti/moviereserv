"use client";

import { useMemo } from "react";

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
import useShowtimes from "../hooks/use-showtimes";
import { useMoviesPagination } from "./use-movies-pagination";
import { useMoviesUrlFilters } from "./use-movies-url-filters";

const MOVIES_PER_BATCH = 20;

const Page = () => {
  const { moviesQuery, genresQuery } = useMovies();
  const { showtimesQuery } = useShowtimes();
  const isLoading =
    moviesQuery.isPending || genresQuery.isPending || showtimesQuery.isPending;
  const movies = moviesQuery.data || [];
  const genres = genresQuery.data || [];
  const showtimes = showtimesQuery.data || [];
  const { filters, titleInput, setTitleInput, replaceFiltersInUrl } =
    useMoviesUrlFilters();

  const { displayedCount, reset, loadMore } =
    useMoviesPagination(MOVIES_PER_BATCH);

  const movieIdsWithShowtimes = useMemo(
    () => new Set(showtimes.map((showtime) => showtime.tmdbMovieId)),
    [showtimes]
  );

  const filteredMovies = useMoviesFilter(
    movies,
    filters,
    movieIdsWithShowtimes
  );
  const displayedMovies = filteredMovies.slice(0, displayedCount);
  const hasMore = displayedCount < filteredMovies.length;
  const hasActiveFilters =
    !!filters.title ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.genreIds.length > 0 ||
    filters.onlyWithShowtimes;

  const availableGenreIds = useMemo(
    () => new Set(movies.flatMap((movie) => movie.genre_ids)),
    [movies]
  );

  const updateFilters = (patch: Partial<FilterState>) => {
    reset();
    replaceFiltersInUrl({
      ...filters,
      ...patch,
    });
  };

  const handleStartDateChange = (value: string | null) => {
    updateFilters({ startDate: value });
  };

  const handleEndDateChange = (value: string | null) => {
    updateFilters({ endDate: value });
  };

  const handleClearFilters = () => {
    setTitleInput("");
    updateFilters(defaultFilters);
  };

  const handleToggleGenre = (genreId: number) => {
    const currentIds = filters.genreIds;
    const exists = currentIds.includes(genreId);
    const nextIds = exists
      ? currentIds.filter((id) => id !== genreId)
      : [...currentIds, genreId];

    updateFilters({ genreIds: nextIds });
  };

  const handleSortChange = (
    sortBy: FilterState["sortBy"],
    sortOrder: FilterState["sortOrder"]
  ) => {
    updateFilters({ sortBy, sortOrder });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>

          {/* Search Skeleton */}
          <Skeleton className="h-9 w-full" />

          {/* Date Pickers, Genre Filter, and Showtimes Facet Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-9 w-full sm:w-[200px]" />
            <Skeleton className="h-9 w-full sm:w-[200px]" />
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 w-full sm:w-[220px]" />
          </div>

          {/* Sort Skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-9 w-[200px]" />
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
            title={titleInput}
            startDate={filters.startDate}
            endDate={filters.endDate}
            selectedGenreIds={filters.genreIds}
            genres={genres}
            availableGenreIds={availableGenreIds}
            hasActiveFilters={hasActiveFilters}
            onlyWithShowtimes={filters.onlyWithShowtimes}
            onTitleChange={setTitleInput}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onToggleGenre={handleToggleGenre}
            onToggleOnlyWithShowtimes={() =>
              updateFilters({
                onlyWithShowtimes: !filters.onlyWithShowtimes,
              })
            }
            onClearFilters={handleClearFilters}
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
                  <MovieCard
                    movie={movie}
                    hasShowtime={movieIdsWithShowtimes.has(movie.id)}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="py-8 text-center">
                <Button onClick={loadMore} variant="outline">
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

export default Page;
