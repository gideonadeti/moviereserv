"use client";

import { Skeleton } from "@/components/ui/skeleton";
import ShowtimeCard from "../components/showtime-card";
import useMovies from "../hooks/use-movies";
import useShowtimes from "../hooks/use-showtimes";

const ShowtimesPage = () => {
  const { showtimesQuery } = useShowtimes();
  const { moviesQuery } = useMovies();
  const showtimes = showtimesQuery.data || [];
  const movies = moviesQuery.data || [];
  const isLoading = showtimesQuery.isPending || moviesQuery.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i.toString()} className="h-[500px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">All Showtimes</h1>

      {showtimes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No upcoming showtimes available.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {showtimes.map((showtime) => (
            <div key={showtime.id} className="h-[500px]">
              <ShowtimeCard showtime={showtime} movies={movies} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowtimesPage;
