"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "../components/movie-card";
import useMovies from "../hooks/use-movies";

const MOVIES_PER_BATCH = 20;

const Page = () => {
  const { moviesQuery } = useMovies();
  const isLoading = moviesQuery.isPending;

  const [displayedCount, setDisplayedCount] = useState(MOVIES_PER_BATCH);
  const movies = moviesQuery.data || [];

  // Displayed movies (for load more)
  const displayedMovies = movies.slice(0, displayedCount);
  const hasMore = displayedCount < movies.length;

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
            {movies.length} movie{movies.length !== 1 ? "s" : ""} found
          </p>
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
                  Showing {displayedCount} of {movies.length} movies
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
