"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "../components/movie-card";
import MoviesFilters from "../components/movies-filters";
import useMovies from "../hooks/use-movies";
import { type FilterState, useMoviesFilter } from "../hooks/use-movies-filter";

const MOVIES_PER_BATCH = 20;

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { moviesQuery } = useMovies();
  const isLoading = moviesQuery.isPending;
  const [displayedCount, setDisplayedCount] = useState(MOVIES_PER_BATCH);
  const [titleInput, setTitleInput] = useState<string>(() => {
    return searchParams.get("title") ?? "";
  });

  const movies = moviesQuery.data || [];
  const searchParamsString = searchParams.toString();

  // Sync the input and reset pagination when the URL changes
  useEffect(() => {
    setTitleInput(searchParams.get("title") ?? "");
    setDisplayedCount(MOVIES_PER_BATCH);
  }, [searchParams]);

  // Debounce input changes into the URL (single source of truth)
  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);
      const trimmed = titleInput.trim();

      if (trimmed) {
        params.set("title", trimmed);
      } else {
        params.delete("title");
      }

      const nextSearch = params.toString();
      const nextUrl = nextSearch ? `${pathname}?${nextSearch}` : pathname;
      const currentSearch = searchParamsString;
      const currentUrl = currentSearch
        ? `${pathname}?${currentSearch}`
        : pathname;

      if (nextUrl !== currentUrl) {
        router.replace(nextUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [titleInput, pathname, router, searchParamsString]);

  // Derive filters directly from URL
  const filters: FilterState = {
    title: searchParams.get("title") ?? "",
  };

  const filteredMovies = useMoviesFilter(movies, filters);
  const displayedMovies = filteredMovies.slice(0, displayedCount);
  const hasMore = displayedCount < filteredMovies.length;

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

        {/* Filters */}
        <MoviesFilters title={titleInput} onTitleChange={setTitleInput} />

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
