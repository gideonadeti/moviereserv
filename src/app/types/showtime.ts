import type { Auditorium } from "./auditorium";

export interface Showtime {
  id: string;
  startTime: string;
  endTime: string;
  price: number;
  tmdbMovieId: number;

  auditorium: Auditorium;
  reservations: Reservation[];
}

export interface Reservation {
  id: string;

  payment: Payment;
  reservedSeats: ReservedSeat[];
}

export interface Payment {
  balance: number;
}
export interface ReservedSeat {
  id: string;
  seatId: string;
}
