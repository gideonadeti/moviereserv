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
