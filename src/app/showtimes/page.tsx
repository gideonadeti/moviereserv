"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ShowtimeCard from "../components/showtime-card";
import ShowtimesFilters from "../components/showtimes-filters";
import ShowtimesSort from "../components/showtimes-sort";
import useMovies from "../hooks/use-movies";
import { usePagination } from "../hooks/use-pagination";
import useShowtimes from "../hooks/use-showtimes";
import { useShowtimesFilter } from "../hooks/use-showtimes-filter";
import { useShowtimesUrlFilters } from "../hooks/use-showtimes-url-filters";

const SHOWTIMES_PER_BATCH = 20;

const ShowtimesPage = () => {
  const { showtimesQuery } = useShowtimes();
  const { moviesQuery } = useMovies();
  const showtimes = showtimesQuery.data || [];
  const movies = moviesQuery.data || [];
  const isLoading = showtimesQuery.isPending || moviesQuery.isPending;
  const { filters, titleInput, setTitleInput, replaceFiltersInUrl } =
    useShowtimesUrlFilters();

  const { displayedCount, reset, loadMore } =
    usePagination(SHOWTIMES_PER_BATCH);

  const filteredAndSortedShowtimes = useShowtimesFilter({
    showtimes,
    movies,
    filters,
  });

  const displayedShowtimes = filteredAndSortedShowtimes.slice(
    0,
    displayedCount
  );
  const hasMore = displayedCount < filteredAndSortedShowtimes.length;

  const hasActiveFilters =
    !!filters.title ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.onlyWithReservations;

  const { minPriceInData, maxPriceInData } = useMemo(() => {
    if (showtimes.length === 0) {
      return {
        minPriceInData: 0,
        maxPriceInData: 100,
      };
    }

    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (const showtime of showtimes) {
      if (showtime.price < min) min = showtime.price;
      if (showtime.price > max) max = showtime.price;
    }

    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      return {
        minPriceInData: 0,
        maxPriceInData: 100,
      };
    }

    return {
      minPriceInData: Math.floor(min),
      maxPriceInData: Math.ceil(max),
    };
  }, [showtimes]);

  const updateFilters = (patch: Partial<typeof filters>) => {
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

  const handlePriceRangeChange = (min: number | null, max: number | null) => {
    updateFilters({
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleSortChange = (
    sortBy: Parameters<typeof ShowtimesSort>[0]["sortBy"],
    sortOrder: Parameters<typeof ShowtimesSort>[0]["sortOrder"]
  ) => {
    updateFilters({ sortBy, sortOrder });
  };

  const handleClearFilters = () => {
    setTitleInput("");
    updateFilters({
      title: "",
      startDate: null,
      endDate: null,
      minPrice: null,
      maxPrice: null,
      onlyWithReservations: false,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-56" />
          </div>

          {/* Search Skeleton */}
          <Skeleton className="h-9 w-full" />

          {/* Date Pickers and Price Filter Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Skeleton className="h-9 w-full sm:w-[200px]" />
            <Skeleton className="h-9 w-full sm:w-[200px]" />
            <Skeleton className="h-9 flex-1" />
          </div>

          {/* Sort Skeleton */}
          <div className="flex justify-end">
            <Skeleton className="h-9 w-[220px]" />
          </div>

          {/* Showtimes Grid Skeleton */}
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
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">All Showtimes</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedShowtimes.length} showtime
            {filteredAndSortedShowtimes.length !== 1 ? "s" : ""} found
          </p>
        </div>

        <div className="space-y-4">
          <ShowtimesFilters
            title={titleInput}
            startDate={filters.startDate}
            endDate={filters.endDate}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            effectiveMinPrice={minPriceInData}
            effectiveMaxPrice={maxPriceInData}
            hasActiveFilters={hasActiveFilters}
            onlyWithReservations={filters.onlyWithReservations}
            onTitleChange={setTitleInput}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onPriceRangeChange={handlePriceRangeChange}
            onToggleOnlyWithReservations={() =>
              updateFilters({
                onlyWithReservations: !filters.onlyWithReservations,
              })
            }
            onClearFilters={handleClearFilters}
          />

          <div className="flex justify-end">
            <ShowtimesSort
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortChange={handleSortChange}
            />
          </div>
        </div>

        {displayedShowtimes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No upcoming showtimes available.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedShowtimes.map((showtime) => (
                <div key={showtime.id} className="h-[500px]">
                  <ShowtimeCard showtime={showtime} movies={movies} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="py-8 text-center">
                <Button onClick={loadMore} variant="outline">
                  Load More
                </Button>
                <p className="mt-2 text-sm text-muted-foreground">
                  Showing {displayedCount} of{" "}
                  {filteredAndSortedShowtimes.length} showtimes
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShowtimesPage;
