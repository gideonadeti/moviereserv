import type { Auditorium } from "./auditorium";

export interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  tmdbMovieId: number;
  numberOfReservations: number;

  auditorium: Auditorium;
  reservations: Reservation[];
}

export interface Reservation {
  id: string;

  reservedSeats: ReservedSeat[];
}

export interface ReservedSeat {
  id: string;
  seatId: string;
}
