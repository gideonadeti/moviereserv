import type { Auditorium } from "./auditorium";

export interface Showtime {
  id: string;
  startTime: Date;
  endTime: Date;
  price: number;
  tmdbMovieId: number;

  auditorium: Auditorium;
}
