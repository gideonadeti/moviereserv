import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { toast } from "sonner";

import type { Genre, Movie } from "../types/movie";
import { fetchGenres, fetchMovies } from "../utils/movies-query-functions";

const useMovies = () => {
  const moviesQuery = useQuery<Movie[], AxiosError<{ status_message: string }>>(
    {
      queryKey: ["movies"],
      queryFn: async () => {
        return fetchMovies();
      },
    }
  );

  const genresQuery = useQuery<Genre[], AxiosError<{ status_message: string }>>(
    {
      queryKey: ["genres"],
      queryFn: async () => {
        return fetchGenres();
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
    genresQuery,
  };
};

export default useMovies;
