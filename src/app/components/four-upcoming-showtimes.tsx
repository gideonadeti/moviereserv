"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useMovies from "../hooks/use-movies";
import useShowtimes from "../hooks/use-showtimes";
import ShowtimeCard from "./showtime-card";

const FourUpcomingShowtimes = () => {
  const { showtimesQuery } = useShowtimes();
  const { moviesQuery } = useMovies();
  const showtimes = showtimesQuery.data || [];
  const fourUpcomingShowtimes = showtimes.slice(0, 4);
  const movies = moviesQuery.data || [];
  const isLoading = showtimesQuery.isPending || moviesQuery.isPending;

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i.toString()} className="h-[500px] w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (showtimes.length === 0) {
    return (
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Upcoming Showtimes</h2>
        <p className="text-muted-foreground">
          No upcoming showtimes available.
        </p>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Upcoming Showtimes</h2>
        <Button asChild variant="outline">
          <Link href="/showtimes">See all</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {fourUpcomingShowtimes.map((showtime) => (
          <div key={showtime.id} className="h-[500px]">
            <ShowtimeCard showtime={showtime} movies={movies} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FourUpcomingShowtimes;
