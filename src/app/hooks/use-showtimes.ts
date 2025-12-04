import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";
import type z from "zod";
import type { reservationSchema } from "../components/create-reservation-dialog";
import type { Reservation, Showtime } from "../types/showtime";
import {
  cancelReservation,
  createReservation,
  fetchShowtimes,
} from "../utils/general-query-functions";

const useShowtimes = () => {
  const queryClient = useQueryClient();
  const showtimesQuery = useQuery<Showtime[], AxiosError<{ message: string }>>({
    queryKey: ["showtimes"],
    queryFn: async () => {
      return fetchShowtimes();
    },
  });

  useEffect(() => {
    if (showtimesQuery.isError) {
      const message =
        showtimesQuery.error?.response?.data?.message ||
        "Failed to fetch showtimes";

      toast.error(message, { id: "fetch-showtimes-error" });
    }
  }, [showtimesQuery.error?.response?.data, showtimesQuery.isError]);

  const createReservationMutation = useMutation<
    Reservation,
    AxiosError<{ message: string }>,
    { showtimeId: string; formValues: z.infer<typeof reservationSchema> }
  >({
    mutationFn: async ({ showtimeId, formValues }) => {
      return createReservation(showtimeId, formValues);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to create reservation";

      toast.error(message, { id: "create-reservation-error" });
    },
    onSuccess: (reservation) => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });

      const balance = reservation.payment.balance;

      if (balance > 0) {
        toast.success(`Reservation made successfully. Balance: $${balance}`, {
          id: "create-reservation-success",
        });
      } else {
        toast.success("Reservation made successfully", {
          id: "create-reservation-success",
        });
      }
    },
  });

  const cancelReservationMutation = useMutation<
    Reservation,
    AxiosError<{ message: string }>,
    { id: string }
  >({
    mutationFn: async ({ id }) => {
      return cancelReservation(id);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to cancel reservation";

      toast.error(message, { id: "cancel-reservation-error" });
    },
    onSuccess: (reservation) => {
      queryClient.setQueryData(["showtimes"], (old: Showtime[]) => {
        return old.map((showtime) => {
          if (showtime.id === reservation.showtimeId) {
            return {
              ...showtime,
              reservations: showtime.reservations.filter(
                (r) => r.id !== reservation.id
              ),
            };
          }

          return showtime;
        });
      });

      toast.success("Reservation cancelled successfully", {
        id: "cancel-reservation-success",
      });
    },
  });

  return {
    showtimesQuery,
    createReservationMutation,
    cancelReservationMutation,
  };
};

export default useShowtimes;
