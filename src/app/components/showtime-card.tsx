"use client";

import { Calendar, Clock, MapPin, Ticket, Users } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useUser from "../hooks/use-user";
import type { Movie } from "../types/movie";
import type { Showtime } from "../types/showtime";
import {
  formatCalendarDate,
  formatDuration,
  formatPrice,
  formatTime,
  getAvailableSeats,
  matchShowtimeWithMovie,
} from "../utils/showtime-utils";
import CreateReservationDialog from "./create-reservation-dialog";
import ShowtimeReservationsDialog from "./user-reservations-dialog";

interface ShowtimeCardProps {
  showtime: Showtime;
  movies: Movie[];
}

const ShowtimeCard = ({ showtime, movies }: ShowtimeCardProps) => {
  const movie = matchShowtimeWithMovie(showtime, movies);
  const availableSeats = getAvailableSeats(showtime);
  const [isCreateReservationDialogOpen, setIsCreateReservationDialogOpen] =
    useState(false);
  const [isReservationsDialogOpen, setIsReservationsDialogOpen] =
    useState(false);
  const { user } = useUser();

  const userReservations = useMemo(
    () =>
      showtime.reservations?.filter(
        (reservation) => reservation.userId === user?.id
      ) ?? [],
    [showtime.reservations, user?.id]
  );

  const hasUserReservations = userReservations.length > 0;

  if (!movie) {
    return null;
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_TMDB_SECURE_IMAGE_BASE_URL}${movie.poster_path}`;
  const priceFormatted = formatPrice(showtime.price);
  const startTimeFormatted = formatTime(showtime.startTime);
  const endTimeFormatted = formatTime(showtime.endTime);
  const startDateFormatted = formatCalendarDate(showtime.startTime);
  const endDateFormatted = formatCalendarDate(showtime.endTime);
  const isSameCalendarDate =
    formatCalendarDate(showtime.startTime) ===
    formatCalendarDate(showtime.endTime);
  const durationFormatted = formatDuration(
    showtime.startTime,
    showtime.endTime
  );

  return (
    <>
      <Card className="relative h-full flex flex-col group transition-shadow hover:shadow-md overflow-hidden py-0">
        {/* Movie Poster */}
        <div className="relative w-full flex-1 overflow-hidden">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-3 p-3">
          {/* Movie Title */}
          <h3 className="font-semibold text-lg line-clamp-2">{movie.title}</h3>

          {/* Date Information */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4 shrink-0" />
            <span>
              {isSameCalendarDate
                ? startDateFormatted
                : `${startDateFormatted} - ${endDateFormatted}`}
            </span>
          </div>

          {/* Time Information */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            <span>
              {startTimeFormatted} - {endTimeFormatted} ({durationFormatted})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-sm">
            <Ticket className="size-4 text-primary shrink-0" />
            <span className="font-medium">{priceFormatted}</span>
          </div>

          {/* Auditorium */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span>{showtime.auditorium.name}</span>
          </div>

          {/* Available Seats */}
          <div className="flex items-center gap-2 text-sm">
            <Users className="size-4 shrink-0" />
            <span
              className={
                availableSeats > 0
                  ? "text-green-600 dark:text-green-400 font-medium"
                  : "text-red-600 dark:text-red-400 font-medium"
              }
            >
              {availableSeats > 0
                ? `${availableSeats} seat${
                    availableSeats !== 1 ? "s" : ""
                  } available`
                : "Sold out"}
            </span>
          </div>

          {/* Make Reservation Button */}
          <Button
            onClick={() => setIsCreateReservationDialogOpen(true)}
            disabled={availableSeats === 0}
          >
            {availableSeats > 0 ? "Make Reservation" : "Sold Out"}
          </Button>
          {/* View My Reservations CTA (only when user has reservations for this showtime) */}
          {hasUserReservations && (
            <Button
              variant="outline"
              onClick={() => setIsReservationsDialogOpen(true)}
            >
              View my reservations ({userReservations.length})
            </Button>
          )}
        </div>
      </Card>
      <CreateReservationDialog
        open={isCreateReservationDialogOpen}
        showtime={showtime}
        movieTitle={movie.title}
        onOpenChange={setIsCreateReservationDialogOpen}
      />
      <ShowtimeReservationsDialog
        open={isReservationsDialogOpen}
        onOpenChange={setIsReservationsDialogOpen}
        showtime={showtime}
        movieTitle={movie.title}
      />
    </>
  );
};

export default ShowtimeCard;
