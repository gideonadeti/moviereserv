"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

const buildFiltersFromSearchParams = (params: URLSearchParams) => {
  const title = params.get("title") ?? defaultFilters.title;
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");
  const genreIdsParam = params.get("genreIds");
  const genreIds =
    genreIdsParam && genreIdsParam.length > 0
      ? genreIdsParam
          .split(",")
          .map((value) => Number.parseInt(value, 10))
          .filter((value) => !Number.isNaN(value))
      : defaultFilters.genreIds;

  const sortBy =
    (params.get("sortBy") as FilterState["sortBy"]) ?? defaultFilters.sortBy;

  const sortOrder =
    (params.get("sortOrder") as FilterState["sortOrder"]) ??
    defaultFilters.sortOrder;

  return {
    ...defaultFilters,
    title,
    startDate,
    endDate,
    genreIds,
    sortBy,
    sortOrder,
  };
};

const buildSearchParamsFromFilters = (
  filters: FilterState,
  baseSearchParamsString: string
) => {
  const params = new URLSearchParams(baseSearchParamsString);
  const trimmedTitle = filters.title.trim();

  if (trimmedTitle) {
    params.set("title", trimmedTitle);
  } else {
    params.delete("title");
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  } else {
    params.delete("startDate");
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  } else {
    params.delete("endDate");
  }

  if (filters.genreIds.length > 0) {
    params.set("genreIds", filters.genreIds.join(","));
  } else {
    params.delete("genreIds");
  }

  if (filters.sortBy !== defaultFilters.sortBy) {
    params.set("sortBy", filters.sortBy);
  } else {
    params.delete("sortBy");
  }

  if (filters.sortOrder !== defaultFilters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  } else {
    params.delete("sortOrder");
  }

  return params;
};

const replaceUrlIfChanged = (
  router: ReturnType<typeof useRouter>,
  pathname: string,
  currentSearchParamsString: string,
  nextParams: URLSearchParams
) => {
  const nextSearch = nextParams.toString();
  const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
  const currentSearch = currentSearchParamsString;
  const currentUrl = currentSearch ? `${pathname}?${currentSearch}` : pathname;

  if (nextUrl !== currentUrl) {
    router.replace(nextUrl, { scroll: false });
  }
};

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { moviesQuery, genresQuery } = useMovies();
  const isLoading = moviesQuery.isPending || genresQuery.isPending;
  const [displayedCount, setDisplayedCount] = useState(MOVIES_PER_BATCH);
  const [titleInput, setTitleInput] = useState<string>(() => {
    return searchParams.get("title") ?? "";
  });

  const movies = moviesQuery.data || [];
  const genres = genresQuery.data || [];
  const searchParamsString = searchParams.toString();
  const filters: FilterState = useMemo(
    () => buildFiltersFromSearchParams(new URLSearchParams(searchParamsString)),
    [searchParamsString]
  );

  // Sync input from URL and reset pagination when URL changes
  useEffect(() => {
    setTitleInput(filters.title ?? "");
    setDisplayedCount(MOVIES_PER_BATCH);
  }, [filters.title]);

  // Debounce input changes into the URL (single source of truth)
  useEffect(() => {
    const handle = setTimeout(() => {
      const nextFilters: FilterState = {
        ...filters,
        title: titleInput,
      };

      const nextParams = buildSearchParamsFromFilters(
        nextFilters,
        searchParamsString
      );

      replaceUrlIfChanged(router, pathname, searchParamsString, nextParams);
    }, 300);

    return () => clearTimeout(handle);
  }, [titleInput, filters, pathname, router, searchParamsString]);

  const filteredMovies = useMoviesFilter(movies, filters);
  const displayedMovies = filteredMovies.slice(0, displayedCount);
  const hasMore = displayedCount < filteredMovies.length;

  const hasActiveFilters =
    !!filters.title ||
    !!filters.startDate ||
    !!filters.endDate ||
    filters.genreIds.length > 0;

  const availableGenreIds = useMemo(
    () => new Set(movies.flatMap((movie) => movie.genre_ids)),
    [movies]
  );

  const replaceFiltersInUrl = (nextFilters: FilterState) => {
    const nextParams = buildSearchParamsFromFilters(
      nextFilters,
      searchParamsString
    );

    replaceUrlIfChanged(router, pathname, searchParamsString, nextParams);
  };

  const handleStartDateChange = (value: string | null) => {
    setDisplayedCount(MOVIES_PER_BATCH);
    replaceFiltersInUrl({
      ...filters,
      startDate: value,
    });
  };

  const handleEndDateChange = (value: string | null) => {
    setDisplayedCount(MOVIES_PER_BATCH);
    replaceFiltersInUrl({
      ...filters,
      endDate: value,
    });
  };

  const handleClearFilters = () => {
    setDisplayedCount(MOVIES_PER_BATCH);
    setTitleInput("");

    replaceFiltersInUrl(defaultFilters);
  };

  const handleToggleGenre = (genreId: number) => {
    setDisplayedCount(MOVIES_PER_BATCH);

    const currentIds = filters.genreIds;
    const exists = currentIds.includes(genreId);
    const nextIds = exists
      ? currentIds.filter((id) => id !== genreId)
      : [...currentIds, genreId];

    replaceFiltersInUrl({
      ...filters,
      genreIds: nextIds,
    });
  };

  const handleSortChange = (
    sortBy: FilterState["sortBy"],
    sortOrder: FilterState["sortOrder"]
  ) => {
    setDisplayedCount(MOVIES_PER_BATCH);
    replaceFiltersInUrl({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  const handleLoadMore = () => {
    setDisplayedCount((prev) => prev + MOVIES_PER_BATCH);
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
            onTitleChange={setTitleInput}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
            onToggleGenre={handleToggleGenre}
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

export default Page;
