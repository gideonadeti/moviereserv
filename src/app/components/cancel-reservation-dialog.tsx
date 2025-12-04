"use client";

import { Loader } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useShowtimes from "../hooks/use-showtimes";

interface CancelReservationDialogProps {
  open: boolean;
  reservationId: string | null;
  onOpenChange: (open: boolean) => void;
}

const CancelReservationDialog = ({
  open,
  onOpenChange,
  reservationId,
}: CancelReservationDialogProps) => {
  const { cancelReservationMutation } = useShowtimes();

  if (!reservationId) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel reservation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel this reservation? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelReservationMutation.isPending}>
            Keep reservation
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={cancelReservationMutation.isPending}
            onClick={() =>
              cancelReservationMutation.mutate(
                { id: reservationId },
                {
                  onSuccess: () => {
                    onOpenChange(false);
                  },
                }
              )
            }
          >
            {cancelReservationMutation.isPending ? (
              <>
                <Loader className="animate-spin" />
                Cancelling...
              </>
            ) : (
              "Yes, cancel it"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelReservationDialog;
