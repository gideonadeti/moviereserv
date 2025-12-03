import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
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

  const onSubmit = (formValues: z.infer<typeof createReservationSchema>) => {
    createReservationMutation.mutate({ showtimeId: showtime.id, formValues });
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
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
