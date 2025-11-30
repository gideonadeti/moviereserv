import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

import type { Movie } from "../types/movie";
import { fetchMovies } from "../utils/movies-query-functions";

const useMovies = () => {
  const moviesQuery = useQuery<Movie[], AxiosError<{ status_message: string }>>(
    {
      queryKey: ["movies"],
      queryFn: async () => {
        return fetchMovies();
      },
    }
  );

  useEffect(() => {
    if (moviesQuery.isError) {
      const message =
        moviesQuery.error?.response?.data?.status_message ||
        "Failed to fetch movies";

      toast.error(message, { id: "fetch-movies-error" });
    }
  }, [moviesQuery.error?.response?.data, moviesQuery.isError]);

  return {
    moviesQuery,
  };
};

export default useMovies;
