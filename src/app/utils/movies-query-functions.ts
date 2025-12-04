import axios from "../libs/tmdb-axios-instance";
import type { Movie } from "../types/movie";

interface MoviesResponse {
  total_pages: number;
  results: Movie[];
}

export const fetchMovies = async () => {
  const accountId = process.env.NEXT_PUBLIC_TMDB_ACCOUNT_ID;
  const prefix = `/account/${accountId}/favorite/movies`;

  try {
    // Start with page 1 to get total pages
    const firstPageResponse = await axios.get<MoviesResponse>(
      `${prefix}?page=1`
    );

    const firstPage = firstPageResponse.data;
    const allMovies = [...firstPage.results];

    // If there are more pages, fetch them all
    if (firstPage.total_pages > 1) {
      const pagePromises = [];

      for (let page = 2; page <= firstPage.total_pages; page++) {
        pagePromises.push(axios.get<MoviesResponse>(`${prefix}?page=${page}`));
      }

      const remainingResponses = await Promise.all(pagePromises);
      const remainingMovies = remainingResponses.flatMap(
        (response) => response.data.results
      );

      allMovies.push(...remainingMovies);
    }

    return allMovies;
  } catch (error) {
    console.error("Error from `fetchMovies`:", error);

    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axios.get("/genre/movie/list");

    return response.data.genres;
  } catch (error) {
    console.error("Error from `fetchGenres`:", error);
    throw error;
  }
};
