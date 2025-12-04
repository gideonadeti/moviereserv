"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUser from "../hooks/use-user";
import type { Showtime } from "../types/showtime";
import { formatPrice } from "../utils/showtime-utils";
import CancelReservationDialog from "./cancel-reservation-dialog";

interface ShowtimeReservationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showtime: Showtime;
  movieTitle: string;
}

const UserReservationsDialog = ({
  open,
  onOpenChange,
  showtime,
  movieTitle,
}: ShowtimeReservationsDialogProps) => {
  const { user } = useUser();
  const [reservationIdToCancel, setReservationIdToCancel] = useState<
    string | null
  >(null);

  const userReservations = useMemo(
    () =>
      showtime.reservations?.filter(
        (reservation) => reservation.userId === user?.id
      ) ?? [],
    [showtime.reservations, user?.id]
  );

  const seatLabelById = useMemo(() => {
    const map = new Map<string, string>();

    for (const seat of showtime.auditorium.seats) {
      map.set(seat.id, seat.label);
    }

    return map;
  }, [showtime.auditorium.seats]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              Your reservations for{" "}
              <span className="font-medium text-primary">{movieTitle}</span>
            </DialogTitle>
            <DialogDescription>
              View your reserved seats and cancel any reservation if needed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {userReservations.map((reservation) => {
              const seatLabels =
                reservation.reservedSeats.length > 0
                  ? reservation.reservedSeats
                      .map(
                        (seat) => seatLabelById.get(seat.seatId) ?? seat.seatId
                      )
                      .join(", ")
                  : "No seats";

              return (
                <Card
                  key={reservation.id}
                  className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Amount charged:</span>{" "}
                      {formatPrice(reservation.amountCharged)}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Seats:</span> {seatLabels}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setReservationIdToCancel(reservation.id)}
                  >
                    Cancel reservation
                  </Button>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
      <CancelReservationDialog
        open={reservationIdToCancel !== null}
        onOpenChange={(openValue) => {
          if (!openValue) {
            setReservationIdToCancel(null);
          }
        }}
        reservationId={reservationIdToCancel}
      />
    </>
  );
};

export default UserReservationsDialog;
