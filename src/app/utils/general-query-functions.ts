import type { z } from "zod";
import type { reservationSchema } from "../components/create-reservation-dialog";
import axios from "../libs/axios-instance";

export const fetchShowtimes = async () => {
  try {
    const response = await axios.get("/showtimes");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchShowtimes`:", error);

    throw error;
  }
};

export const createReservation = async (
  showtimeId: string,
  formValues: z.infer<typeof reservationSchema>
) => {
  try {
    const response = await axios.post("/reservations", {
      showtimeId,
      ...formValues,
    });

    return response.data;
  } catch (error) {
    console.error("Error from `createReservation`:", error);

    throw error;
  }
};
