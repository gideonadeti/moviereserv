export interface Auditorium {
  id: string;
  name: string;
  capacity: number;

  seats: Seat[];
}

export interface Seat {
  id: string;
  label: string;
}
