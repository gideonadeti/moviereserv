"use client";

import { useRefreshAccessToken } from "@/app/components/auth-provider";
import LandingPage from "@/app/components/landing-page";
import useMovies from "@/app/hooks/use-movies";
import useUser from "@/app/hooks/use-user";

const Page = () => {
  const { moviesQuery } = useMovies();
  const { user } = useUser();
  const { isRefreshing } = useRefreshAccessToken();
  const isLoading = isRefreshing || moviesQuery.isPending;
  const movies = moviesQuery.data || [];

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div>Loading...</div>
      </div>
    );
  }

  // If authenticated, return null (as requested)
  if (user) {
    return (
      <div>
        <h1>Movies</h1>
        <p>Total movies: {movies.length}</p>
      </div>
    );
  }

  // If not authenticated, show landing page
  return <LandingPage />;
};

export default Page;
