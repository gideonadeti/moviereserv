"use client";

import { format, getYear, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useMovies from "../../hooks/use-movies";
import type { Genre } from "../../types/movie";

const MovieDetailPage = () => {
  const params = useParams();
  const movieId = params?.movieId as string;
  const { moviesQuery, genresQuery } = useMovies();
  const isLoading = moviesQuery.isPending || genresQuery.isPending;
  const movies = moviesQuery.data || [];
  const genres = genresQuery.data || [];

  // Find the movie by ID
  const movie = useMemo(() => {
    const id = Number.parseInt(movieId, 10);

    if (Number.isNaN(id)) return null;

    return movies.find((m) => m.id === id) || null;
  }, [movieId, movies]);

  // Create a genre map for quick lookup
  const genreMap = useMemo(() => {
    return new Map<number, Genre>(genres.map((g) => [g.id, g]));
  }, [genres]);

  // Get genre names for the movie
  const movieGenres = useMemo(() => {
    if (!movie) return [];

    return movie.genre_ids
      .map((id) => genreMap.get(id))
      .filter((g): g is Genre => g !== undefined);
  }, [movie, genreMap]);

  // Extract year from release date
  const releaseYear = useMemo(() => {
    if (!movie) return null;

    return getYear(parseISO(movie.release_date));
  }, [movie]);

  // Format release date
  const formattedReleaseDate = useMemo(() => {
    if (!movie) return null;

    return format(parseISO(movie.release_date), "MM/dd/yyyy");
  }, [movie]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Section Skeleton */}
        <div className="relative">
          {/* Backdrop Skeleton */}
          <div className="absolute inset-0">
            <Skeleton className="size-full rounded-none" />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-background/80" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-start">
              {/* Poster Skeleton - Left Side */}
              <div className="shrink-0">
                <Skeleton className="h-[450px] w-[300px] rounded-lg" />
              </div>

              {/* Movie Information Skeleton - Right Side */}
              <div className="flex-1 space-y-4">
                {/* Title Skeleton */}
                <Skeleton className="h-12 w-3/4 max-w-md" />

                {/* Release Date and Genres Skeleton */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-48" />
                </div>

                {/* Rating Skeleton */}
                <Skeleton className="h-7 w-20" />

                {/* Overview Skeleton */}
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-full max-w-3xl" />
                  <Skeleton className="h-4 w-full max-w-3xl" />
                  <Skeleton className="h-4 w-5/6 max-w-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The movie you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/movies">Back to Movies</Link>
        </Button>
      </div>
    );
  }

  const prefix = process.env.NEXT_PUBLIC_TMDB_SECURE_IMAGE_BASE_URL;
  const backdropUrl = `${prefix}${movie.backdrop_path}`;
  const posterUrl = `${prefix}${movie.poster_path}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Backdrop Image */}
        <div className="absolute inset-0">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-background via-background/95 to-background/80" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Poster - Left Side */}
            <div className="shrink-0">
              <div className="relative h-[450px] w-[300px] overflow-hidden rounded-lg shadow-2xl">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Movie Information - Right Side */}
            <div className="flex-1 space-y-4 text-foreground">
              {/* Title with Year */}
              <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                {movie.title} ({releaseYear})
              </h1>

              {/* Release Date and Genres - Single Line */}
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                <span className="font-medium">{formattedReleaseDate}</span>
                {movieGenres.length > 0 && <span>·</span>}
                {movieGenres.length > 0 && (
                  <span>{movieGenres.map((g) => g.name).join(", ")}</span>
                )}
              </div>

              {/* Rating */}
              <div className="text-xl font-bold">
                {movie.vote_average.toFixed(1)} / 10
              </div>

              {/* Overview */}
              {movie.overview && (
                <div className="space-y-2 pt-2">
                  <h2 className="text-lg font-semibold">Overview</h2>
                  <p className="text-base leading-relaxed text-muted-foreground max-w-3xl">
                    {movie.overview}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
