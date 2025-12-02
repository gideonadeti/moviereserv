import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

import type { Showtime } from "../types/showtime";
import { fetchShowtimes } from "../utils/general-query-functions";

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

  return {
    showtimesQuery,
  };
};

export default useShowtimes;
