import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";
import type z from "zod";
import type { reservationSchema } from "../components/create-reservation-dialog";
import type { Reservation, Showtime } from "../types/showtime";
import {
  createReservation,
  fetchShowtimes,
} from "../utils/general-query-functions";

const useShowtimes = () => {
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
    { formValues: z.infer<typeof reservationSchema> }
  >({
    mutationFn: async ({ formValues }) => {
      return createReservation(formValues);
    },
  });

  return {
    showtimesQuery,
    createReservationMutation,
  };
};

export default useShowtimes;
