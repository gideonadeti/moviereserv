import axios from "axios";

const tmdbAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
  },
});

export default tmdbAxiosInstance;
