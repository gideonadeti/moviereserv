import { differenceInMinutes, format, parseISO } from "date-fns";

import type { Movie } from "../types/movie";
import type { Showtime } from "../types/showtime";

/**
 * Format a date to a readable time string (e.g., "2:00 PM")
 */
export const formatTime = (date: Date | string) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  return format(dateObj, "h:mm a");
};

/**
 * Format a date to a readable calendar date string (e.g., "Wed, Jan 3")
 */
export const formatCalendarDate = (date: Date | string) => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  return format(dateObj, "EEE, MMM d");
};

/**
 * Calculate duration in minutes from start and end times
 */
export const getDurationMinutes = (
  startTime: Date | string,
  endTime: Date | string
) => {
  const start = typeof startTime === "string" ? parseISO(startTime) : startTime;
  const end = typeof endTime === "string" ? parseISO(endTime) : endTime;

  return differenceInMinutes(end, start);
};

/**
 * Format duration as a readable string (e.g., "2h 30m")
 */
export const formatDuration = (
  startTime: Date | string,
  endTime: Date | string
) => {
  const minutes = getDurationMinutes(startTime, endTime);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Format price as currency
 */
export const formatPrice = (price: number) => {
  return (
    "$" +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
};

/**
 * Match showtimes with movies using tmdbMovieId
 */
export const matchShowtimeWithMovie = (showtime: Showtime, movies: Movie[]) => {
  return movies.find((movie) => movie.id === showtime.tmdbMovieId) || null;
};

/**
 * Calculate available seats for a showtime
 */
export const getAvailableSeats = (showtime: Showtime) => {
  return showtime.auditorium.capacity - showtime.numberOfReservations;
};
