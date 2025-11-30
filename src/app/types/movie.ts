export interface Movie {
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  overview: string;
  poster_path: string;
  release_date: Date;
  title: string;
  vote_average: number;
}

export interface Genre {
  id: number;
  name: string;
}
