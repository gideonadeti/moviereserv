export interface Reservation {
  id: string;
  userId: string;
  showtimeId: string;
  amountCharged: number;
  amountPaid: number;
  createdAt: Date;
  updatedAt: Date;

  payment: Payment;
}

export interface Payment {
  amountCharged: number;
  amountPaid: number;
  balance: number;
}
