"use client";

import { format, parseISO } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <Card className="relative h-full flex flex-col group transition-shadow hover:shadow-md pt-0 pb-2 overflow-hidden">
      {/* Image Container - 4/5 of card height */}
      <div className="relative w-full flex-4 overflow-hidden">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {/* Dropdown Menu Button - Top Right Corner */}
        <div className="absolute right-2 top-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="size-8 rounded-full bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  // Placeholder - do nothing for now
                }}
              >
                Make reservation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
  );
};

export default MovieCard;
