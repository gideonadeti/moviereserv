import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useShowtimes from "../hooks/use-showtimes";
import type { Showtime } from "../types/showtime";
import CustomDialogFooter from "./custom-dialog-footer";
import SeatGrid from "./seat-grid";

interface CreateReservationDialogProps {
  open: boolean;
  showtime: Showtime;
  movieTitle: string;
  onOpenChange: (open: boolean) => void;
}

export const reservationSchema = z.object({
  seatIds: z.array(z.string()).min(1),
  amountPaid: z.coerce.number<number>().min(0),
});

const CreateReservationDialog = ({
  open,
  showtime,
  movieTitle,
  onOpenChange,
}: CreateReservationDialogProps) => {
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { createReservationMutation } = useShowtimes();
  const createReservationSchema = reservationSchema.refine(
    (data) => data.amountPaid >= data.seatIds.length * showtime.price,
    {
      message:
        "Amount paid must be greater than or equal to the number of seats times the price",
      path: ["amountPaid"],
    }
  );

  const form = useForm<z.infer<typeof createReservationSchema>>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      seatIds: [],
      amountPaid: 0,
    },
  });

  // Calculate reserved seat IDs from all reservations
  const reservedSeatIds = useMemo(() => {
    const reservedIds = new Set<string>();
    showtime.reservations?.forEach((reservation) => {
      reservation.reservedSeats?.forEach((reservedSeat) => {
        reservedIds.add(reservedSeat.seatId);
      });
    });
    return reservedIds;
  }, [showtime.reservations]);

  // Get seats from auditorium
  const seats = showtime.auditorium?.seats || [];

  // Get selected seat IDs from form
  const selectedSeatIds = form.watch("seatIds");

  // Handle seat toggle
  const handleSeatToggle = (seatId: string) => {
    const currentSeatIds = form.getValues("seatIds");
    const isSelected = currentSeatIds.includes(seatId);

    if (isSelected) {
      // Deselect seat
      const newSeatIds = currentSeatIds.filter((id) => id !== seatId);
      form.setValue("seatIds", newSeatIds, { shouldDirty: true });
    } else {
      // Select seat
      form.setValue("seatIds", [...currentSeatIds, seatId], {
        shouldDirty: true,
      });
    }
  };

  // Auto-calculate amount paid when seats change
  useEffect(() => {
    const seatCount = selectedSeatIds.length;
    const calculatedAmount = seatCount * showtime.price;
    const currentAmount = form.getValues("amountPaid");

    // Only update if the current amount doesn't match the calculated amount
    // This allows users to manually override the amount
    if (seatCount > 0 && currentAmount === 0) {
      form.setValue("amountPaid", calculatedAmount, { shouldDirty: true });
    } else if (seatCount === 0) {
      form.setValue("amountPaid", 0, { shouldDirty: true });
    }
  }, [selectedSeatIds.length, showtime.price, form]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset({
        seatIds: [],
        amountPaid: 0,
      });
    }
  }, [open, form]);

  const onSubmit = (formValues: z.infer<typeof createReservationSchema>) => {
    createReservationMutation.mutate(
      { showtimeId: showtime.id, formValues },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            Make Reservation for{" "}
            <span className="font-medium text-primary">{movieTitle}</span>
          </DialogTitle>
          <DialogDescription>
            Select the seats you want to reserve and the amount you want to pay.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden field for seatIds - controlled by SeatGrid */}
            <FormField
              control={form.control}
              name="seatIds"
              render={() => (
                <FormItem>
                  <FormControl>
                    <input type="hidden" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Seat Selection Grid */}
            <FormItem>
              <FormLabel>Select Seats</FormLabel>
              <FormControl>
                {seats.length > 0 ? (
                  <SeatGrid
                    seats={seats}
                    reservedSeatIds={reservedSeatIds}
                    selectedSeatIds={selectedSeatIds}
                    onSeatToggle={handleSeatToggle}
                  />
                ) : (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No seats available for this auditorium
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Amount Paid Input */}
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      {...field}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {selectedSeatIds.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {selectedSeatIds.length} seat
                      {selectedSeatIds.length !== 1 ? "s" : ""} × $
                      {showtime.price.toFixed(2)} = $
                      {(selectedSeatIds.length * showtime.price).toFixed(2)}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <button type="submit" className="hidden" ref={submitButtonRef} />
          </form>
        </Form>
        <CustomDialogFooter
          isPending={createReservationMutation.isPending}
          disabled={!form.formState.isDirty}
          handleCancel={() => onOpenChange(false)}
          handleSubmit={() => submitButtonRef.current?.click()}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateReservationDialog;
