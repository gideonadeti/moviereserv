import type { Auditorium } from "./auditorium";

export interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  tmdbMovieId: number;
  numberOfReservations: number;

  auditorium: Auditorium;
}
