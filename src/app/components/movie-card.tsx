"use client";

import { format, parseISO } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const imageUrl = `${process.env.NEXT_PUBLIC_TMDB_SECURE_IMAGE_BASE_URL}${movie.poster_path}`;

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);

    return format(date, "MMM dd, yyyy");
  };

  return (
    <Link href={`/movies/${movie.id}`} className="block h-full">
      <Card className="relative h-full flex flex-col group transition-shadow hover:shadow-md pt-0 pb-2 overflow-hidden cursor-pointer">
        {/* Image Container - 4/5 of card height */}
        <div className="w-full flex-4 overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Bottom Section - Title, Rating, Release Date */}
        <div className="flex-1 flex flex-col justify-between p-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
            {movie.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">
                {movie.vote_average.toFixed(1)}
              </span>
              <span>/ 10</span>
            </div>
            <span>{formatDate(movie.release_date)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default MovieCard;
