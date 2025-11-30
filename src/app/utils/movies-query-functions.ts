import axios from "../libs/tmdb-axios-instance";
import type { Movie } from "../types/movie";

interface MoviesResponse {
  total_pages: number;
  results: Movie[];
}

export const fetchMovies = async () => {
  try {
    // Start with page 1 to get total pages
    const firstPageResponse = await axios.get<MoviesResponse>(
      "/favorite/movies?page=1"
    );

    const firstPage = firstPageResponse.data;
    const allMovies = [...firstPage.results];

    // If there are more pages, fetch them all
    if (firstPage.total_pages > 1) {
      const pagePromises = [];

      for (let page = 2; page <= firstPage.total_pages; page++) {
        pagePromises.push(
          axios.get<MoviesResponse>(`/favorite/movies?page=${page}`)
        );
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
